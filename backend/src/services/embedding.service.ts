import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { magnitude } from '../utils/similarity.js';

export class EmbeddingService {
  private openai: OpenAI | null = null;
  private isUsingOpenAI: boolean = false;

  constructor() {
    if (config.openai.apiKey && config.openai.apiKey.trim().length > 0) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
        baseURL: config.openai.baseURL,
      });
      this.isUsingOpenAI = true;
      logger.info(`[EmbeddingService] Initialized OpenAI client with model '${config.openai.embeddingModel}'.`);
    } else {
      this.isUsingOpenAI = false;
      logger.info('[EmbeddingService] Using local embedding vectorizer.');
    }
  }

  public isConfigured(): boolean {
    return this.isUsingOpenAI;
  }

  public getModelName(): string {
    return this.isUsingOpenAI ? config.openai.embeddingModel : 'local-deterministic-256d';
  }

  /**
   * Generates a single vector embedding for the input text.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.generateEmbeddings([text]);
    return embeddings[0];
  }

  /**
   * Generates vector embeddings for a batch of input texts.
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    if (this.isUsingOpenAI && this.openai) {
      try {
        const response = await this.openai.embeddings.create({
          model: config.openai.embeddingModel,
          input: texts,
        });
        return response.data.map((item) => item.embedding);
      } catch (error) {
        logger.error('[EmbeddingService] OpenAI embedding request failed:', error);
        throw new Error(
          `Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return texts.map((t) => this.generateLocalDeterministicEmbedding(t));
  }

  public static readonly STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
    'each', 'few', 'for', 'from', 'further',
    'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
    'just', 'me', 'more', 'most', 'my', 'myself',
    'no', 'nor', 'not', 'now',
    'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'she', 'should', 'so', 'some', 'such',
    'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very',
    'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
    'you', 'your', 'yours', 'yourself', 'yourselves'
  ]);

  private generateLocalDeterministicEmbedding(text: string): number[] {
    const DIMENSIONS = 256;
    const vector = new Array<number>(DIMENSIONS).fill(0);
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = cleaned.split(/\s+/).filter((t) => t.length > 0);

    if (tokens.length === 0) {
      return vector;
    }

    // Filter out stop words for high topical selectivity
    const contentTokens = tokens.filter((t) => !EmbeddingService.STOP_WORDS.has(t));
    const activeTokens = contentTokens.length > 0 ? contentTokens : tokens;

    // Word tokens, bigrams, and character subword n-grams (FastText style)
    for (let i = 0; i < activeTokens.length; i++) {
      const word = activeTokens[i];
      this.accumulateHash(word, vector, DIMENSIONS, 1.0);

      // Subword character n-grams (handles plurals/stems like grocery vs groceries)
      if (word.length >= 4) {
        for (let len = 3; len <= 5; len++) {
          for (let j = 0; j <= word.length - len; j++) {
            const sub = word.slice(j, j + len);
            this.accumulateHash(sub, vector, DIMENSIONS, 0.4);
          }
        }
      }

      if (i < activeTokens.length - 1) {
        const bigram = `${activeTokens[i]}_${activeTokens[i + 1]}`;
        this.accumulateHash(bigram, vector, DIMENSIONS, 1.2);
      }
    }

    // Normalize to unit length (L2 norm) so cosine similarity is directly dot product
    const norm = magnitude(vector);
    if (norm > 0) {
      for (let i = 0; i < DIMENSIONS; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }

  private accumulateHash(term: string, vector: number[], dims: number, weight: number): void {
    let hash = 5381;
    for (let i = 0; i < term.length; i++) {
      hash = ((hash << 5) + hash) + term.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % dims;
    const sign = (hash & 1) === 0 ? 1 : -1;
    vector[index] += sign * weight;
  }
}

export const embeddingService = new EmbeddingService();

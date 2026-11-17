import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { embeddingService } from './embedding.service.js';
import { vectorService, ScoredChunk } from './vector.service.js';
import { QueryResponse, Citation, SourceSnippet } from '../types/index.js';

class RAGService {
  private openai: OpenAI | null = null;
  private isUsingOpenAI: boolean = false;

  constructor() {
    if (config.openai.apiKey && config.openai.apiKey.trim().length > 0) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
        baseURL: config.openai.baseURL,
      });
      this.isUsingOpenAI = true;
    }
  }

  /**
   * Executes the full RAG pipeline:
   * Question -> Embedding -> Semantic Search -> Context Assembly -> LLM Grounded Answer -> Response with Citations
   */
  async query(question: string, topK?: number): Promise<QueryResponse> {
    const startTime = Date.now();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      throw new Error('Question cannot be empty.');
    }

    logger.info(`[RAGService] Processing query: "${trimmedQuestion}"`);

    const queryVector = await embeddingService.generateEmbedding(trimmedQuestion);
    const retrievedChunks = vectorService.findSimilarChunks(
      queryVector,
      topK || config.chunking.maxRetrievalChunks
    );

    if (retrievedChunks.length === 0) {
      return {
        question: trimmedQuestion,
        answer:
          'No relevant documents or saved URLs were found to answer this question. Add related content to your knowledge inbox first.',
        citations: [],
        sources: [],
        model: this.getModelName(),
        processingTimeMs: Date.now() - startTime,
      };
    }

    const sources: SourceSnippet[] = retrievedChunks.map((chunk, index) => {
      const citationNumber = index + 1;
      return {
        citationNumber,
        chunkId: chunk.chunkId,
        itemId: chunk.itemId,
        chunkIndex: chunk.chunkIndex,
        title: chunk.title,
        sourceType: chunk.sourceType,
        sourceUrl: chunk.sourceUrl,
        content: chunk.content,
        similarity: chunk.similarity,
      };
    });

    const citations: Citation[] = sources.map((s) => ({
      citationNumber: s.citationNumber,
      chunkId: s.chunkId,
      itemId: s.itemId,
      title: s.title,
      sourceType: s.sourceType,
      sourceUrl: s.sourceUrl,
    }));

    const contextText = sources
      .map(
        (s) =>
          `[Source ${s.citationNumber}] (Title: "${s.title}", Type: ${s.sourceType})\n${s.content}`
      )
      .join('\n\n');

    // 6. Generate answer using LLM
    let generatedAnswer = '';

    if (this.isUsingOpenAI && this.openai) {
      generatedAnswer = await this.generateOpenAIAnswer(trimmedQuestion, contextText);
    } else {
      generatedAnswer = this.generateLocalGroundedAnswer(trimmedQuestion, sources);
    }

    return {
      question: trimmedQuestion,
      answer: generatedAnswer,
      citations,
      sources,
      model: this.getModelName(),
      processingTimeMs: Date.now() - startTime,
    };
  }

  public getModelName(): string {
    return this.isUsingOpenAI ? config.openai.chatModel : 'local-extractive-grounding-engine';
  }

  /**
   * Generates answer via OpenAI Chat Completion API with strict grounding instructions.
   */
  private async generateOpenAIAnswer(question: string, context: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client is not initialized.');
    }

    const systemPrompt = `You are a precise, grounded AI assistant for a personal Knowledge Inbox.
Your task is to answer the user's question using ONLY the retrieved context sources provided below.

CRITICAL INSTRUCTIONS:
1. Answer using ONLY information found directly in the retrieved sources. Do NOT fabricate, assume, or invent facts.
2. Every statement or claim you make MUST cite its source using bracketed numbers, e.g. [1] or [1][2].
3. Only cite source numbers that actually appear in the context.
4. If the provided context does NOT contain enough information to answer the question, state:
   "Based on your saved knowledge, there is not enough information to answer this question."
   Do NOT attempt to guess from outside knowledge.
5. Format your response cleanly and objectively.`;

    const userPrompt = `Retrieved Knowledge Context:
-----------------------
${context}
-----------------------

User Question: ${question}

Grounded Answer (with citations):`;

    try {
      const response = await this.openai.chat.completions.create({
        model: config.openai.chatModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1, // Near-zero temperature for maximum factual consistency
      });

      return (
        response.choices[0]?.message?.content?.trim() ||
        'Based on your saved knowledge, there is not enough information to answer this question.'
      );
    } catch (error) {
      logger.error('[RAGService] OpenAI chat completion failed:', error);
      throw new Error(
        `Failed to generate AI answer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Deterministic extractive grounding engine used when OPENAI_API_KEY is not set.
   * Finds the most salient extracted sentences from top retrieved chunks and attaches citations.
   */
  private generateLocalGroundedAnswer(question: string, sources: SourceSnippet[]): string {
    const questionKeywords = question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const relevantSentences: { text: string; citationNum: number; score: number }[] = [];

    for (const source of sources) {
      // Split chunk into sentences
      const sentences = source.content
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15);

      for (const sentence of sentences) {
        const lowerSent = sentence.toLowerCase();
        let matches = 0;
        for (const kw of questionKeywords) {
          if (lowerSent.includes(kw)) {
            matches++;
          }
        }

        if (matches > 0) {
          relevantSentences.push({
            text: sentence,
            citationNum: source.citationNumber,
            score: matches * source.similarity,
          });
        }
      }
    }

    if (relevantSentences.length === 0) {
      // Return highest similarity source preview as direct citation
      const topSource = sources[0];
      return `According to your saved knowledge in "${topSource.title}", ${topSource.content.slice(
        0,
        220
      )}... [${topSource.citationNumber}]`;
    }

    // Sort by relevance score
    relevantSentences.sort((a, b) => b.score - a.score);

    // Pick top unique sentences
    const picked: string[] = [];
    const usedTexts = new Set<string>();

    for (const item of relevantSentences.slice(0, 4)) {
      if (!usedTexts.has(item.text)) {
        usedTexts.add(item.text);
        picked.push(`${item.text} [${item.citationNum}]`);
      }
    }

    return picked.join(' ');
  }
}

export const ragService = new RAGService();

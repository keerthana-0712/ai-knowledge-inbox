import { dbService } from '../database/db.js';
import { cosineSimilarity } from '../utils/similarity.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { embeddingService, EmbeddingService } from './embedding.service.js';
import { SourceSnippet } from '../types/index.js';

export interface ScoredChunk {
  chunkId: string;
  itemId: string;
  chunkIndex: number;
  title: string;
  sourceType: 'note' | 'url';
  sourceUrl: string | null;
  content: string;
  similarity: number;
}

class VectorService {
  /**
   * Retrieves top K chunks most semantically similar to the query vector.
   */
  findSimilarChunks(
    queryVector: number[],
    topK: number = config.chunking.maxRetrievalChunks,
    rawQuery?: string
  ): ScoredChunk[] {
    const allChunks = dbService.getAllChunksWithEmbeddings();
    if (allChunks.length === 0) {
      logger.info('[VectorService] No chunks stored in database.');
      return [];
    }

    const queryKeywords = rawQuery
      ? rawQuery
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 2 && !EmbeddingService.STOP_WORDS.has(w))
      : [];

    const scoredChunks: ScoredChunk[] = [];

    for (const chunk of allChunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        continue;
      }

      let score = cosineSimilarity(queryVector, chunk.embedding);

      // In local mode, apply hybrid lexical boost for exact keyword and title matches
      if (!embeddingService.isConfigured() && queryKeywords.length > 0) {
        const fullChunkText = (chunk.item_title + ' ' + chunk.chunk_content).toLowerCase();
        let matched = 0;
        for (const kw of queryKeywords) {
          if (fullChunkText.includes(kw)) {
            matched++;
          } else if (kw.length >= 4 && fullChunkText.includes(kw.slice(0, 4))) {
            matched += 0.7;
          }
        }
        if (matched > 0) {
          score += (matched / queryKeywords.length) * 0.35;
        }
      }

      const effectiveThreshold = embeddingService.isConfigured()
        ? config.chunking.minSimilarityThreshold
        : 0.08;

      // Only retain chunks that meet the minimum similarity threshold
      if (score >= effectiveThreshold) {
        scoredChunks.push({
          chunkId: chunk.id,
          itemId: chunk.item_id,
          chunkIndex: chunk.chunk_index,
          title: chunk.item_title,
          sourceType: chunk.source_type,
          sourceUrl: chunk.source_url,
          content: chunk.chunk_content,
          similarity: Math.round(score * 1000) / 1000, // 3 decimal places
        });
      }
    }

    // Sort descending by similarity score
    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    // Limit to top K
    const results = scoredChunks.slice(0, topK);

    logger.info(
      `[VectorService] Evaluated ${allChunks.length} chunks; retrieved ${results.length} relevant chunks (top score: ${
        results[0]?.similarity ?? 0
      }).`
    );

    return results;
  }
}

export const vectorService = new VectorService();

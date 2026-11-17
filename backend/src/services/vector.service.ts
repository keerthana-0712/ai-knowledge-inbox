import { dbService } from '../database/db.js';
import { cosineSimilarity } from '../utils/similarity.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
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
    topK: number = config.chunking.maxRetrievalChunks
  ): ScoredChunk[] {
    const allChunks = dbService.getAllChunksWithEmbeddings();
    if (allChunks.length === 0) {
      logger.info('[VectorService] No chunks stored in database.');
      return [];
    }

    const scoredChunks: ScoredChunk[] = [];

    for (const chunk of allChunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        continue;
      }

      const score = cosineSimilarity(queryVector, chunk.embedding);

      // Only retain chunks that meet the minimum similarity threshold
      if (score >= config.chunking.minSimilarityThreshold) {
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

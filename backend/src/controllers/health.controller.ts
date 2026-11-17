import { Request, Response, NextFunction } from 'express';
import { dbService } from '../database/db.js';
import { embeddingService } from '../services/embedding.service.js';
import { ragService } from '../services/rag.service.js';
import { HealthResponse } from '../types/index.js';

export function healthHandler(_req: Request, res: Response, next: NextFunction): void {
  try {
    const stats = dbService.getStats();
    const isAiConfigured = embeddingService.isConfigured();

    const response: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        itemsCount: stats.itemsCount,
        chunksCount: stats.chunksCount,
      },
      ai: {
        provider: isAiConfigured ? 'openai' : 'local-fallback',
        configured: isAiConfigured,
        embeddingModel: embeddingService.getModelName(),
        chatModel: ragService.getModelName(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

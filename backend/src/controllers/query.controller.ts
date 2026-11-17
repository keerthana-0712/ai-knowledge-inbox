import { Request, Response, NextFunction } from 'express';
import { ragService } from '../services/rag.service.js';
import { QueryRequest } from '../types/index.js';

export async function queryHandler(
  req: Request<{}, {}, QueryRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { question, topK } = req.body;
    const result = await ragService.query(question, topK);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

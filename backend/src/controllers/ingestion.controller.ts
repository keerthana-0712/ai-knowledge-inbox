import { Request, Response, NextFunction } from 'express';
import { ingestionService } from '../services/ingestion.service.js';
import { IngestInput } from '../types/index.js';

export async function ingestHandler(
  req: Request<{}, {}, IngestInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body;
    let result;

    if (input.type === 'note') {
      result = await ingestionService.ingestNote(input.title, input.content);
    } else if (input.type === 'url') {
      result = await ingestionService.ingestUrl(input.url, input.title);
    } else {
      res.status(400).json({ success: false, error: 'Invalid ingestion type specified.' });
      return;
    }

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

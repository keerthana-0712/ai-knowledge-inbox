import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const IngestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('note'),
    title: z.string().min(1, 'Title is required.').max(200, 'Title cannot exceed 200 characters.'),
    content: z.string().min(1, 'Content is required.').max(100000, 'Content is too large.'),
  }),
  z.object({
    type: z.literal('url'),
    url: z.string().url('A valid URL is required.'),
    title: z.string().max(200, 'Title cannot exceed 200 characters.').optional(),
  }),
]);

export const QuerySchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.').max(1000, 'Question is too long.'),
  topK: z.number().int().min(1).max(20).optional(),
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}

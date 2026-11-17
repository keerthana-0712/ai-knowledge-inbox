import { Request, Response, NextFunction } from 'express';
import { dbService } from '../database/db.js';

export function getItemsHandler(_req: Request, res: Response, next: NextFunction): void {
  try {
    const items = dbService.getAllItems();
    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    next(error);
  }
}

export function getItemByIdHandler(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    const item = dbService.getItemById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        error: `Item with id '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export function deleteItemHandler(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    const deleted = dbService.deleteItem(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: `Item with id '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Item '${id}' and its indexed chunks were permanently removed.`,
    });
  } catch (error) {
    next(error);
  }
}

import { Router } from 'express';
import {
  getItemsHandler,
  getItemByIdHandler,
  deleteItemHandler,
} from '../controllers/item.controller.js';

const router = Router();

router.get('/items', getItemsHandler);
router.get('/items/:id', getItemByIdHandler);
router.delete('/items/:id', deleteItemHandler);

export default router;

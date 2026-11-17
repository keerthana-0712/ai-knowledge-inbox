import { Router } from 'express';
import ingestionRoutes from './ingestion.routes.js';
import itemRoutes from './item.routes.js';
import queryRoutes from './query.routes.js';
import { healthHandler } from '../controllers/health.controller.js';

const router = Router();

// Health check endpoint
router.get('/health', healthHandler);

// Ingestion endpoints
router.use('/', ingestionRoutes);

// Item retrieval and management endpoints
router.use('/', itemRoutes);

// Semantic RAG query endpoints
router.use('/', queryRoutes);

export default router;

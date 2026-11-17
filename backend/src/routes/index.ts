import { Router } from 'express';
import ingestionRoutes from './ingestion.routes.js';
import itemRoutes from './item.routes.js';
import queryRoutes from './query.routes.js';
import { healthHandler } from '../controllers/health.controller.js';

const router = Router();

// Root API overview endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'AI Knowledge Inbox API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      items: 'GET /items',
      ingest: 'POST /ingest',
      query: 'POST /query',
      deleteItem: 'DELETE /items/:id',
    },
    webApp: 'http://localhost:5173',
  });
});

// Health check endpoint
router.get('/health', healthHandler);

// Ingestion endpoints
router.use('/', ingestionRoutes);

// Item retrieval and management endpoints
router.use('/', itemRoutes);

// Semantic RAG query endpoints
router.use('/', queryRoutes);

export default router;

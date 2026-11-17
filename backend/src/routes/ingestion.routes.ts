import { Router } from 'express';
import { ingestHandler } from '../controllers/ingestion.controller.js';
import { validateBody, IngestSchema } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/ingest', validateBody(IngestSchema), ingestHandler);

export default router;

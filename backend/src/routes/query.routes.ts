import { Router } from 'express';
import { queryHandler } from '../controllers/query.controller.js';
import { validateBody, QuerySchema } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/query', validateBody(QuerySchema), queryHandler);

export default router;

import { Router } from 'express';
import { getOpportunities } from '../../controllers/opportunity.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getOpportunities);

export default router;


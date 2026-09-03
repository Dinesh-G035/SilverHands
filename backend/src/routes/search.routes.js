import { Router } from 'express';
import { searchMarketplace, aiSearch } from '../../controllers/search.controller.js';
import { aiLimiter } from '../../middleware/rateLimiter.middleware.js';

const router = Router();

router.get('/', searchMarketplace);
router.post('/ai', aiLimiter, aiSearch);

export default router;


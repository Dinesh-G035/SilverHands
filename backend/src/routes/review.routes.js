import { Router } from 'express';
import { createReview, getReviewsForTarget } from '../../controllers/review.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createReviewSchema } from '../../validators/index.js';

const router = Router();

router.get('/', getReviewsForTarget);
router.post('/', protect, validateBody(createReviewSchema), createReview);

export default router;


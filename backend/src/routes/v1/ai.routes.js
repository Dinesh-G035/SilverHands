import { Router } from 'express';
import {
  uploadVoiceAudio,
  parseVoiceProfile,
  confirmAIProfile,
  generateListing,
  suggestPricing,
} from '../../controllers/ai.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { aiLimiter } from '../../middleware/rateLimiter.middleware.js';
import { uploadMiddleware } from '../../services/upload.service.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { parseVoiceSchema, generateListingSchema, suggestPriceSchema } from '../../validators/index.js';

const router = Router();

router.use(aiLimiter);

router.post('/upload-voice', protect, uploadMiddleware.single('audio'), uploadVoiceAudio);
router.post('/parse-voice-profile', protect, validateBody(parseVoiceSchema), parseVoiceProfile);
router.post('/confirm-profile', protect, confirmAIProfile);
router.post('/generate-listing', protect, validateBody(generateListingSchema), generateListing);
router.post('/suggest-price', protect, validateBody(suggestPriceSchema), suggestPricing);

export default router;


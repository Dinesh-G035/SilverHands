import { Router } from 'express';
import {
  requestOTP,
  verifyOTP,
  refreshAccessToken,
  logout,
  logoutAll,
} from '../../controllers/auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimiter.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { sendOtpSchema, verifyOtpSchema, refreshTokenSchema } from '../../validators/index.js';

const router = Router();

router.post('/send-otp', authLimiter, validateBody(sendOtpSchema), requestOTP);
router.post('/verify-otp', authLimiter, validateBody(verifyOtpSchema), verifyOTP);
router.post('/refresh-token', validateBody(refreshTokenSchema), refreshAccessToken);
router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);

export default router;


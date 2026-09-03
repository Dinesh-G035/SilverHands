import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleRazorpayWebhook,
} from '../../controllers/payment.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../../validators/index.js';

const router = Router();

router.post('/create-order', protect, validateBody(createPaymentOrderSchema), createPaymentOrder);
router.post('/verify', protect, validateBody(verifyPaymentSchema), verifyPayment);
router.post('/webhook', handleRazorpayWebhook);

export default router;


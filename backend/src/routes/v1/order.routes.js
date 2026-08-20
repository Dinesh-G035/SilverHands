import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} from '../../controllers/order.controller.js';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createOrderSchema } from '../../validators/index.js';

const router = Router();

router.use(protect);

router.get('/', getMyOrders);
router.post('/checkout', validateBody(createOrderSchema), createOrder);
router.get('/seller-orders', restrictTo('provider', 'admin'), getSellerOrders);
router.patch('/:id/status', restrictTo('provider', 'admin'), updateOrderStatus);

export default router;


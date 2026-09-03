import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../../controllers/cart.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { addToCartSchema } from '../../validators/index.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', validateBody(addToCartSchema), addToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/clear', clearCart);

export default router;


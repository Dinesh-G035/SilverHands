import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../../controllers/product.controller.js';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createProductSchema } from '../../validators/index.js';

const router = Router();

router.get('/', getProducts);
router.get('/my-products', protect, restrictTo('provider', 'admin'), getMyProducts);
router.get('/:id', getProductById);

router.post('/', protect, restrictTo('provider', 'admin'), validateBody(createProductSchema), createProduct);
router.patch('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;


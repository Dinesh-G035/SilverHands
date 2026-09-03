import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  publishService,
  pauseService,
  getMyServices,
} from '../../controllers/service.controller.js';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createServiceSchema } from '../../validators/index.js';

const router = Router();

router.get('/', getServices);
router.get('/my-services', protect, restrictTo('provider', 'admin'), getMyServices);
router.get('/:id', getServiceById);

router.post('/', protect, restrictTo('provider', 'admin'), validateBody(createServiceSchema), createService);
router.patch('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);
router.patch('/:id/publish', protect, publishService);
router.patch('/:id/pause', protect, pauseService);

export default router;


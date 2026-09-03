import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} from '../../controllers/booking.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createBookingSchema, updateBookingStatusSchema } from '../../validators/index.js';

const router = Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', validateBody(createBookingSchema), createBooking);
router.get('/:id', getBookingById);
router.patch('/:id/status', validateBody(updateBookingStatusSchema), updateBookingStatus);

export default router;


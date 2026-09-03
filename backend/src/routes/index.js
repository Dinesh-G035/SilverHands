import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import aiRoutes from './ai.routes.js';
import serviceRoutes from './service.routes.js';
import productRoutes from './product.routes.js';
import searchRoutes from './search.routes.js';
import opportunityRoutes from './opportunity.routes.js';
import bookingRoutes from './booking.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import reviewRoutes from './review.routes.js';
import messageRoutes from './message.routes.js';
import notificationRoutes from './notification.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/services', serviceRoutes);
router.use('/products', productRoutes);
router.use('/search', searchRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;


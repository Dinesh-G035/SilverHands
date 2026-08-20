import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Order } from '../models/Order.js';
import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const createReview = async (req, res, next) => {
  try {
    const reviewerId = req.user._id;
    const { targetType, serviceId, productId, bookingId, orderId, rating, comment } = req.body;

    let revieweeId;

    if (targetType === 'service') {
      if (!serviceId) throw new AppError('serviceId is required for service reviews', 400);

      // Eligibility check: User must have a completed booking
      const completedBooking = await Booking.findOne({
        serviceId,
        customerId: reviewerId,
        status: 'completed',
      });

      if (!completedBooking && req.user.role !== 'admin') {
        throw new AppError('You can only review a service after completing a booking for it.', 403);
      }

      const service = await Service.findById(serviceId);
      if (!service) throw new AppError('Service not found', 404);
      revieweeId = service.providerId;

      // Create review
      const review = await Review.create({
        reviewerId,
        revieweeId,
        serviceId,
        bookingId: bookingId || completedBooking?._id,
        targetType: 'service',
        rating,
        comment,
      });

      // Recalculate average rating on Service
      const reviews = await Review.find({ serviceId, moderationStatus: 'approved' });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
      service.rating = Math.round(avgRating * 10) / 10;
      service.reviewCount = reviews.length;
      await service.save();

      return sendSuccess(res, review, 'Service review submitted', 201);
    }

    if (targetType === 'product') {
      if (!productId) throw new AppError('productId is required for product reviews', 400);

      const product = await Product.findById(productId);
      if (!product) throw new AppError('Product not found', 404);
      revieweeId = product.sellerId;

      const review = await Review.create({
        reviewerId,
        revieweeId,
        productId,
        orderId,
        targetType: 'product',
        rating,
        comment,
      });

      // Recalculate rating on Product
      const reviews = await Review.find({ productId, moderationStatus: 'approved' });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
      product.rating = Math.round(avgRating * 10) / 10;
      product.reviewCount = reviews.length;
      await product.save();

      return sendSuccess(res, review, 'Product review submitted', 201);
    }

    throw new AppError('Invalid review targetType', 400);
  } catch (error) {
    next(error);
  }
};

export const getReviewsForTarget = async (req, res, next) => {
  try {
    const { serviceId, productId } = req.query;
    const filter = { moderationStatus: 'approved' };

    if (serviceId) filter.serviceId = serviceId;
    if (productId) filter.productId = productId;

    const reviews = await Review.find(filter)
      .populate('reviewerId', 'name profileImage city locality')
      .sort({ createdAt: -1 });

    return sendSuccess(res, reviews, 'Reviews retrieved');
  } catch (error) {
    next(error);
  }
};


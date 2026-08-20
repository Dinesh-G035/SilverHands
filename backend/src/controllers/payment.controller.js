import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { Order } from '../models/Order.js';
import { WebhookEvent } from '../models/WebhookEvent.js';
import { Notification } from '../models/Notification.js';
import { PaymentService } from '../services/payment.service.js';
import { markOrderPaidAndDeductStock } from './order.controller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, orderId } = req.body;
    let amount = 0;
    let providerId;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) throw new AppError('Booking not found', 404);
      amount = booking.estimatedPrice;
      providerId = booking.providerId;
    } else if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) throw new AppError('Order not found', 404);
      amount = order.totalAmount;
    } else {
      throw new AppError('Either bookingId or orderId is required to create a payment order', 400);
    }

    const receiptId = `rcpt_${Date.now()}_${req.user._id.toString().slice(-4)}`;
    const razorpayOrder = await PaymentService.createRazorpayOrder(amount, receiptId);

    const payment = await Payment.create({
      bookingId,
      orderId,
      customerId: req.user._id,
      providerId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      status: 'pending',
    });

    return sendSuccess(
      res,
      {
        paymentId: payment._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_silverhands12345',
      },
      'Payment order created successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId, orderId } = req.body;

    const isValid = PaymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.status = 'failed';
        payment.failureReason = 'Invalid Razorpay HMAC signature verification';
        await payment.save();
      }
      throw new AppError('Payment signature verification failed. Invalid payment data.', 400);
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) throw new AppError('Payment record not found', 404);

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'successful';
    await payment.save();

    if (payment.bookingId || bookingId) {
      const bId = payment.bookingId || bookingId;
      const booking = await Booking.findById(bId);
      if (booking) {
        booking.status = 'accepted';
        await booking.save();

        await Notification.create({
          userId: booking.providerId,
          title: 'Payment Received for Booking',
          message: `Payment of ₹${payment.amount} confirmed for booking #${booking._id.toString().slice(-6)}.`,
          type: 'payment_update',
        });
      }
    }

    if (payment.orderId || orderId) {
      const oId = payment.orderId || orderId;
      await markOrderPaidAndDeductStock(oId.toString());
    }

    return sendSuccess(res, payment, 'Payment verified and status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBodyBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));

    const isVerified = PaymentService.verifyWebhookSignature(rawBodyBuffer, signature);
    if (!isVerified) {
      logger.warn('[Webhook] Webhook signature verification failed');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const payload = req.body;
    const eventId = payload.event_id || `evt_${Date.now()}_${Math.random()}`;

    // Idempotency check
    const existingEvent = await WebhookEvent.findOne({ eventId });
    if (existingEvent && existingEvent.status === 'processed') {
      logger.info(`[Webhook] Duplicate eventId ${eventId} ignored.`);
      return res.status(200).json({ success: true, message: 'Event already processed' });
    }

    const webhookEvent = await WebhookEvent.create({
      eventId,
      eventType: payload.event || 'payment.captured',
      payload,
      status: 'received',
    });

    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment && payment.status !== 'successful') {
          payment.status = 'successful';
          payment.razorpayPaymentId = paymentEntity.id;
          await payment.save();

          if (payment.orderId) {
            await markOrderPaidAndDeductStock(payment.orderId.toString());
          }
        }
      }
    }

    webhookEvent.status = 'processed';
    webhookEvent.processedAt = new Date();
    await webhookEvent.save();

    return res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    logger.error(`[Webhook Error] ${error}`);
    return res.status(500).json({ success: false, message: 'Webhook handler error' });
  }
};


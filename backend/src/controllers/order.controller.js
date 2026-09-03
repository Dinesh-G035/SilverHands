import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const createOrder = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    const { deliveryAddress, pickupOption } = req.body;

    const cart = await Cart.findOne({ userId: customerId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty. Add products to cart before checkout.', 400);
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate active products & stock availability
    for (const item of cart.items) {
      const product = item.productId;
      if (!product || product.status !== 'active') {
        throw new AppError(`Product "${product?.title || 'Unknown'}" is no longer available.`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for "${product.title}". Only ${product.stock} available.`, 400);
      }

      const priceSnapshot = product.price; // Capture price snapshot
      totalAmount += priceSnapshot * item.quantity;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        title: product.title,
        priceAtPurchase: priceSnapshot,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      customerId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      pickupOption: pickupOption || false,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Clear cart after successful order creation
    cart.items = [];
    await cart.save();

    return sendSuccess(res, order, 'Order created successfully. Proceed to payment.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const filter = { customerId: req.user._id };
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return sendSuccess(res, orders, 'Customer orders retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'items.sellerId': sellerId })
      .populate('customerId', 'name mobile city locality profileImage')
      .sort({ createdAt: -1 });

    return sendSuccess(res, orders, 'Seller orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) throw new AppError('Order not found', 404);

    order.status = status;
    await order.save();

    await Notification.create({
      userId: order.customerId,
      title: 'Order Status Update',
      message: `Your order #${order._id.toString().slice(-6)} is now "${status}".`,
      type: 'order_update',
      link: `/orders/${order._id}`,
    });

    return sendSuccess(res, order, `Order status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to fulfill order payment and deduct stock atomically.
 */
export const markOrderPaidAndDeductStock = async (orderId, session) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  if (order.paymentStatus === 'successful') {
    return order; // Already processed
  }

  // Atomic stock deduction for each product
  for (const item of order.items) {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        stock: { $gte: item.quantity },
      },
      {
        $inc: { stock: -item.quantity },
      },
      { new: true, session }
    );

    if (!updatedProduct) {
      throw new AppError(`Failed to update stock for item ${item.title}. Item may be out of stock.`, 400);
    }

    if (updatedProduct.stock === 0) {
      updatedProduct.status = 'out_of_stock';
      await updatedProduct.save({ session });
    }
  }

  order.paymentStatus = 'successful';
  order.status = 'paid';
  await order.save({ session });

  return order;
};


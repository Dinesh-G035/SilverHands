import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: {
      street: { type: String, default: '' },
      locality: { type: String, default: '' },
      city: { type: String, required: true },
      pincode: { type: String, default: '' },
      mobile: { type: String, required: true },
    },
    pickupOption: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'cancelled', 'refund_pending', 'refunded'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', OrderSchema);


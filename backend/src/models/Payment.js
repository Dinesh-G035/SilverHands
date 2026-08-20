import mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'cancelled', 'refund_pending', 'refunded'],
      default: 'pending',
      index: true,
    },
    failureReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', PaymentSchema);


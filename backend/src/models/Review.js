import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    targetType: {
      type: String,
      enum: ['service', 'product'],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    moderationStatus: {
      type: String,
      enum: ['approved', 'under_review', 'flagged'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', ReviewSchema);


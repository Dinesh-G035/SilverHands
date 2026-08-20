import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true, trim: true, index: 'text' },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 1 },
    images: [{ type: String }],
    deliveryOptions: [
      {
        type: String,
        enum: ['pickup', 'delivery'],
        default: 'delivery',
      },
    ],
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'archived'],
      default: 'active',
      index: true,
    },
    moderationStatus: {
      type: String,
      enum: ['approved', 'under_review', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', ProductSchema);


import mongoose from 'mongoose';

const { Schema } = mongoose;

const AvailabilitySlotSchema = new Schema(
  {
    dayOfWeek: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true, trim: true, index: 'text' },
    category: { type: String, required: true, index: true },
    skills: [{ type: String, index: true }],
    priceType: {
      type: String,
      enum: ['hourly', 'fixed', 'per_unit'],
      default: 'hourly',
    },
    price: { type: Number, required: true, min: 0 },
    mode: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'offline',
    },
    availability: [AvailabilitySlotSchema],
    images: [{ type: String }],
    language: {
      type: String,
      enum: ['en', 'ta', 'hi', 'te', 'kn', 'mr', 'bn'],
      default: 'en',
    },
    city: { type: String, required: true, index: true },
    locality: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    yearsOfExperience: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'paused'],
      default: 'published',
      index: true,
    },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    moderationStatus: {
      type: String,
      enum: ['approved', 'under_review', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ location: '2dsphere' });

export const Service = mongoose.model('Service', ServiceSchema);


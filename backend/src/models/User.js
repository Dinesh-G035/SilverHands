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

const UserSchema = new Schema(
  {
    mobile: { type: String, required: true, unique: true, index: true },
    name: { type: String, trim: true },
    role: {
      type: String,
      enum: ['provider', 'customer', 'admin'],
      default: 'customer',
      required: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ta', 'hi', 'te', 'kn', 'mr', 'bn'],
      default: 'en',
    },
    profileImage: { type: String, default: '' },
    city: { type: String, default: '', index: true },
    locality: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.2707, 13.0827], // Default Chennai coordinates
      },
    },
    seniorMode: { type: Boolean, default: false },
    verificationStatus: {
      mobileVerified: { type: Boolean, default: false },
      identityVerified: { type: Boolean, default: false },
      experienceVerified: { type: Boolean, default: false },
    },
    availability: [AvailabilitySlotSchema],
    bio: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ location: '2dsphere' });

export const User = mongoose.model('User', UserSchema);


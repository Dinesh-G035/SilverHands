import mongoose from 'mongoose';

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookingDate: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true },
    durationHours: { type: Number, default: 1 },
    location: { type: String, default: '' },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    estimatedPrice: { type: Number, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'requested',
      index: true,
    },
    cancellationReason: { type: String, default: '' },
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

BookingSchema.index({ providerId: 1, bookingDate: 1, timeSlot: 1, status: 1 });

export const Booking = mongoose.model('Booking', BookingSchema);


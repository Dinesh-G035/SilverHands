import mongoose from 'mongoose';

const { Schema } = mongoose;

const OTPSchema = new Schema(
  {
    mobile: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    attemptsCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model('OTP', OTPSchema);


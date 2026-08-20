import bcrypt from 'bcryptjs';
import { OTP } from '../models/OTP.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';

export class OTPService {
  /**
   * Generates a 6-digit OTP, hashes it, saves to DB with 5-minute expiry.
   * @param {string} mobile - 10-digit Indian mobile number
   * @returns {Promise<{ message: string, mockOtp?: string }>}
   */
  static async sendOTP(mobile) {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtps = await OTP.countDocuments({
      mobile,
      createdAt: { $gte: fifteenMinsAgo },
    });

    if (recentOtps >= 5) {
      throw new AppError('Too many OTP requests for this mobile number. Please try again after 15 minutes.', 429);
    }

    const useMockOtp = env.OTP_PROVIDER === 'mock' && (env.NODE_ENV === 'development' || env.NODE_ENV === 'test');
    const otpCode = useMockOtp ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ mobile });

    await OTP.create({
      mobile,
      otpHash,
      attemptsCount: 0,
      expiresAt,
    });

    if (env.OTP_PROVIDER === 'twilio') {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = env;
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        throw new AppError('Twilio OTP provider is not configured. Please set the Twilio credentials before enabling real OTP delivery.', 500);
      }

      const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `+91${mobile}`,
          From: TWILIO_PHONE_NUMBER,
          Body: `Your SilverHands OTP is ${otpCode}. It is valid for 5 minutes.`,
        }).toString(),
      });

      const twilioPayload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new AppError(twilioPayload.message || 'Failed to send OTP via Twilio.', 500);
      }

      logger.info(`Twilio SMS OTP sent to ${mobile}.`);
    } else if (useMockOtp) {
      logger.info(`[DEV MOCK OTP] Mobile: ${mobile} -> OTP: ${otpCode}`);
    } else {
      logger.warn(`OTP provider is not configured. Returning a generated code only for local testing: ${mobile} -> ${otpCode}`);
    }

    return {
      message: 'OTP sent successfully to ' + mobile,
      ...(useMockOtp ? { mockOtp: otpCode } : {}),
    };
  }

  /**
   * Verifies the OTP code entered by the user.
   * @param {string} mobile
   * @param {string} otpCode
   * @returns {Promise<boolean>}
   */
  static async verifyOTP(mobile, otpCode) {
    const record = await OTP.findOne({ mobile });

    if (!record) {
      throw new AppError('OTP expired or not requested. Please request a new OTP.', 400);
    }

    if (record.attemptsCount >= 3) {
      await OTP.deleteOne({ _id: record._id });
      throw new AppError('Maximum OTP verification attempts exceeded. Please request a new OTP.', 429);
    }

    const isValid = await bcrypt.compare(otpCode, record.otpHash);

    if (!isValid) {
      record.attemptsCount += 1;
      await record.save();
      throw new AppError(`Invalid OTP entered. ${3 - record.attemptsCount} attempts remaining.`, 400);
    }

    await OTP.deleteOne({ _id: record._id });
    return true;
  }
}


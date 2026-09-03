import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { OTP } from '../models/OTP.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';

export class OTPService {
  /**
   * Generates a 6-digit OTP, hashes it, saves to DB with 5-minute expiry.
  * @param {string} email - User email address
   * @returns {Promise<{ message: string, mockOtp?: string }>}
   */
  static async sendOTP(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtps = await OTP.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: fifteenMinsAgo },
    });

    if (recentOtps >= 5) {
      throw new AppError('Too many OTP requests for this email address. Please try again after 15 minutes.', 429);
    }

    const useMockOtp = process.env.NODE_ENV === 'test' || (process.env.OTP_PROVIDER === 'mock' && process.env.NODE_ENV === 'development');
    const otpCode = useMockOtp ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email: normalizedEmail });

    await OTP.create({
      email: normalizedEmail,
      otpHash,
      attemptsCount: 0,
      expiresAt,
    });

    if (process.env.OTP_PROVIDER === 'email' && !useMockOtp) {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) {
        throw new AppError('Email OTP provider is not configured. Please set the SMTP credentials before enabling email OTP delivery.', 500);
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: normalizedEmail,
        subject: 'Your SilverHands OTP',
        text: `Your SilverHands OTP is ${otpCode}. It is valid for 5 minutes.`,
      });
      logger.info(`Email OTP sent to ${normalizedEmail}.`);
    } else if (useMockOtp) {
      logger.info(`[DEV MOCK OTP] Email: ${normalizedEmail} -> OTP: ${otpCode}`);
    } else {
      logger.warn(`OTP provider is not configured. Generated code is unavailable for email: ${normalizedEmail}`);
    }

    return {
      message: 'OTP sent successfully to ' + normalizedEmail,
      ...(useMockOtp ? { mockOtp: otpCode } : {}),
    };
  }

  /**
   * Verifies the OTP code entered by the user.
  * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<boolean>}
   */
  static async verifyOTP(email, otpCode) {
    const record = await OTP.findOne({ email: email.trim().toLowerCase() });

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


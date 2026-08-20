import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { OTPService } from '../services/otp.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';
import { serializeUserPublic } from '../utils/serializers.js';

/**
 * Create the access/refresh token pair and its persistable refresh-token hash.
 * @param {string} userId MongoDB user identifier.
 * @param {string} role Authenticated user role.
 * @returns {{accessToken: string, refreshToken: string, refreshTokenHash: string}}
 */
function generateTokens(userId, role) {
  const accessToken = jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: userId, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  return { accessToken, refreshToken, refreshTokenHash };
}

/**
 * Request an OTP for a mobile number.
 * @param {import('express').Request} req Express request containing `body.mobile`.
 * @param {import('express').Response} res Express response.
 * @param {import('express').NextFunction} next Express error callback.
 * @returns {Promise<import('express').Response|void>}
 */
export const requestOTP = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const result = await OTPService.sendOTP(mobile);
    return sendSuccess(res, result, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp, role, name } = req.body;

    await OTPService.verifyOTP(mobile, otp);

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        mobile,
        name: name || `User ${mobile.slice(-4)}`,
        role: role || 'customer',
        verificationStatus: {
          mobileVerified: true,
          identityVerified: false,
          experienceVerified: false,
        },
      });
    } else {
      if (!user.verificationStatus.mobileVerified) {
        user.verificationStatus.mobileVerified = true;
        await user.save();
      }
    }

    const { accessToken, refreshToken, refreshTokenHash } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Save multi-device session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Session.create({
      user: user._id,
      refreshTokenHash,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '',
      expiresAt,
    });

    return sendSuccess(
      res,
      {
        user: serializeUserPublic(user),
        accessToken,
        refreshToken,
      },
      'Authentication successful'
    );
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token. Please login again.', 401);
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await Session.findOne({ refreshTokenHash, user: decoded.id });
    if (!session) {
      throw new AppError('Session expired or revoked. Please login again.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated.', 401);
    }

    const tokens = generateTokens(user._id.toString(), user.role);

    // Update session hash
    session.refreshTokenHash = tokens.refreshTokenHash;
    await session.save();

    return sendSuccess(
      res,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      'Tokens refreshed successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await Session.deleteOne({ refreshTokenHash });
    }
    return sendSuccess(res, null, 'Logged out successfully from current device');
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    if (req.user) {
      await Session.deleteMany({ user: req.user._id });
    }
    return sendSuccess(res, null, 'Logged out successfully from all devices');
  } catch (error) {
    next(error);
  }
};


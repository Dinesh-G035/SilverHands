import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
  const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  return { accessToken, refreshToken, refreshTokenHash };
}

/**
 * Request an OTP for an email address.
 * @param {import('express').Request} req Express request containing `body.email`.
 * @param {import('express').Response} res Express response.
 * @param {import('express').NextFunction} next Express error callback.
 * @returns {Promise<import('express').Response|void>}
 */
export const requestOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (purpose === 'signup' && await User.exists({ email: email.trim().toLowerCase() })) {
      throw new AppError('Duplicate value entered for email. Please use another value.', 400);
    }
    const result = await OTPService.sendOTP(email);
    return sendSuccess(res, result, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, mobile, otp, role, name } = req.body;

    if (role === 'admin') {
      throw new AppError('Administrators must use email and password login.', 400);
    }

    await OTPService.verifyOTP(email, otp);

    if (mobile && await User.exists({ mobile })) {
      const emailUser = await User.findOne({ email: email.trim().toLowerCase() }).select('_id');
      const mobileUser = await User.findOne({ mobile }).select('_id');
      if (!emailUser || !mobileUser._id.equals(emailUser._id)) {
        throw new AppError('Duplicate value entered for mobile. Please use another value.', 400);
      }
    }

    let user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      user = await User.create({
        email: email.trim().toLowerCase(),
        mobile: mobile || '',
        name: name || `User ${email.split('@')[0]}`,
        role: role || 'customer',
        verificationStatus: {
          emailVerified: true,
          mobileVerified: false,
          identityVerified: false,
          experienceVerified: false,
        },
      });
    } else {
      if (!user.verificationStatus.emailVerified) {
        user.verificationStatus.emailVerified = true;
        if (mobile && !user.mobile) user.mobile = mobile;
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

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' }).select('+passwordHash');

    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError('Invalid admin email or password.', 401);
    }

    if (otp) await OTPService.verifyOTP(email, otp);

    const { accessToken, refreshToken, refreshTokenHash } = generateTokens(user._id.toString(), user.role);
    await Session.create({
      user: user._id,
      refreshTokenHash,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return sendSuccess(res, {
      user: serializeUserPublic(user),
      accessToken,
      refreshToken,
    }, 'Admin authentication successful');
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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


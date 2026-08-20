import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { Report } from '../models/Report.js';
import { AuditService } from '../services/audit.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const getUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(res, users, 'Admin user list retrieved');
  } catch (error) {
    next(error);
  }
};

export const verifyUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mobileVerified, identityVerified, experienceVerified } = req.body;

    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);

    if (mobileVerified !== undefined) user.verificationStatus.mobileVerified = mobileVerified;
    if (identityVerified !== undefined) user.verificationStatus.identityVerified = identityVerified;
    if (experienceVerified !== undefined) user.verificationStatus.experienceVerified = experienceVerified;

    await user.save();

    await AuditService.log({
      actorId: req.user._id.toString(),
      action: 'USER_VERIFIED',
      targetId: user._id.toString(),
      targetModel: 'User',
      ipAddress: req.ip,
      changes: user.verificationStatus,
    });

    return sendSuccess(res, user, 'User verification status updated');
  } catch (error) {
    next(error);
  }
};

export const moderateListingAdmin = async (req, res, next) => {
  try {
    const { type, id } = req.params; // type: 'service' | 'product'
    const { moderationStatus } = req.body;

    if (type === 'service') {
      const service = await Service.findById(id);
      if (!service) throw new AppError('Service not found', 404);

      service.moderationStatus = moderationStatus;
      await service.save();

      await AuditService.log({
        actorId: req.user._id.toString(),
        action: 'SERVICE_MODERATED',
        targetId: service._id.toString(),
        targetModel: 'Service',
        changes: { moderationStatus },
      });

      return sendSuccess(res, service, 'Service moderation status updated');
    } else if (type === 'product') {
      const product = await Product.findById(id);
      if (!product) throw new AppError('Product not found', 404);

      product.moderationStatus = moderationStatus;
      await product.save();

      await AuditService.log({
        actorId: req.user._id.toString(),
        action: 'PRODUCT_MODERATED',
        targetId: product._id.toString(),
        targetModel: 'Product',
        changes: { moderationStatus },
      });

      return sendSuccess(res, product, 'Product moderation status updated');
    }

    throw new AppError('Invalid listing type', 400);
  } catch (error) {
    next(error);
  }
};

export const getReportsAdmin = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name mobile city')
      .sort({ createdAt: -1 });

    return sendSuccess(res, reports, 'Reports retrieved for admin');
  } catch (error) {
    next(error);
  }
};

export const resolveReportAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findById(id);
    if (!report) throw new AppError('Report not found', 404);

    report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    await report.save();

    await AuditService.log({
      actorId: req.user._id.toString(),
      action: 'REPORT_RESOLVED',
      targetId: report._id.toString(),
      targetModel: 'Report',
      changes: { status, adminNotes },
    });

    return sendSuccess(res, report, 'Report resolved');
  } catch (error) {
    next(error);
  }
};


import { Report } from '../models/Report.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createReport = async (req, res, next) => {
  try {
    const reporterId = req.user._id;
    const { targetType, targetId, reason, description } = req.body;

    const report = await Report.create({
      reporterId,
      targetType,
      targetId,
      reason,
      description: description || '',
      status: 'pending',
    });

    return sendSuccess(res, report, 'Report submitted successfully. Our team will review it shortly.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporterId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, reports, 'User submitted reports');
  } catch (error) {
    next(error);
  }
};


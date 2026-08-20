import { AIService } from '../services/ai.service.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const uploadVoiceAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an audio recording file', 400);
    }
    const transcript = await AIService.transcribeAudio(req.file.path);
    return sendSuccess(res, { transcript, fileUrl: `/uploads/${req.file.filename}` }, 'Voice recording uploaded and transcribed');
  } catch (error) {
    next(error);
  }
};

export const parseVoiceProfile = async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const result = await AIService.parseVoiceProfile(transcript);
    return sendSuccess(res, result, 'Voice profile parsed successfully');
  } catch (error) {
    next(error);
  }
};

export const confirmAIProfile = async (req, res, next) => {
  try {
    const { skills, yearsOfExperience, profileTitle } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found', 404);

    user.role = 'provider';
    if (yearsOfExperience !== undefined) user.yearsOfExperience = yearsOfExperience;
    if (profileTitle) user.bio = profileTitle;
    await user.save();

    if (Array.isArray(skills)) {
      for (const skillName of skills) {
        await Skill.findOneAndUpdate(
          { name: skillName },
          { name: skillName, category: 'General' },
          { upsert: true }
        );
      }
    }

    return sendSuccess(res, { user }, 'AI profile confirmed and saved');
  } catch (error) {
    next(error);
  }
};

export const generateListing = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const result = await AIService.generateListing(prompt);
    return sendSuccess(res, result, 'Draft listing generated successfully');
  } catch (error) {
    next(error);
  }
};

export const suggestPricing = async (req, res, next) => {
  try {
    const { category, yearsOfExperience, city } = req.body;
    const result = await AIService.suggestPricing({
      category,
      yearsOfExperience: yearsOfExperience || req.user?.yearsOfExperience || 0,
      city: city || req.user?.city,
    });
    return sendSuccess(res, result, 'Price recommendation generated');
  } catch (error) {
    next(error);
  }
};


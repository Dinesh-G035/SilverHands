import { User } from '../models/User.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';
import { serializeUserPublic } from '../utils/serializers.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User profile not found', 404);

    return sendSuccess(res, serializeUserPublic(user), 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User profile not found', 404);

    const {
      name,
      role,
      preferredLanguage,
      profileImage,
      city,
      locality,
      latitude,
      longitude,
      seniorMode,
      bio,
      yearsOfExperience,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (city !== undefined) user.city = city;
    if (locality !== undefined) user.locality = locality;
    if (seniorMode !== undefined) user.seniorMode = seniorMode;
    if (bio !== undefined) user.bio = bio;
    if (yearsOfExperience !== undefined) user.yearsOfExperience = yearsOfExperience;

    if (latitude !== undefined && longitude !== undefined) {
      user.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    await user.save();

    return sendSuccess(res, serializeUserPublic(user), 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getProviderPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await User.findById(id);
    if (!provider || provider.role !== 'provider') {
      throw new AppError('Provider not found', 404);
    }

    const userCoords = req.user?.location?.coordinates;
    return sendSuccess(res, serializeUserPublic(provider, userCoords), 'Provider public profile');
  } catch (error) {
    next(error);
  }
};


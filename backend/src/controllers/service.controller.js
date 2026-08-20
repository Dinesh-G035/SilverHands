import { Service } from '../models/Service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';
import { serializeServicePublic } from '../utils/serializers.js';

export const createService = async (req, res, next) => {
  try {
    const providerId = req.user._id;

    const {
      title,
      description,
      category,
      skills,
      priceType,
      price,
      mode,
      availability,
      images,
      language,
      city,
      locality,
      latitude,
      longitude,
      yearsOfExperience,
    } = req.body;

    const coords = [
      longitude !== undefined ? longitude : req.user.location?.coordinates?.[0] || 80.2707,
      latitude !== undefined ? latitude : req.user.location?.coordinates?.[1] || 13.0827,
    ];

    const service = await Service.create({
      providerId,
      title,
      description,
      category,
      skills,
      priceType: priceType || 'hourly',
      price,
      mode: mode || 'offline',
      availability: availability || [],
      images: images || [],
      language: language || req.user.preferredLanguage || 'en',
      city: city || req.user.city || 'Chennai',
      locality: locality || req.user.locality || '',
      location: {
        type: 'Point',
        coordinates: coords,
      },
      yearsOfExperience: yearsOfExperience || req.user.yearsOfExperience || 0,
      status: 'published',
    });

    return sendSuccess(res, serializeServicePublic(service), 'Service created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const filter = { status: 'published', moderationStatus: 'approved' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.city) filter.city = req.query.city;

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('providerId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const userCoords = req.user?.location?.coordinates;
    const serialized = services.map((s) => serializeServicePublic(s, userCoords));

    return sendSuccess(res, serialized, 'Services retrieved successfully', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate('providerId');
    if (!service) throw new AppError('Service listing not found', 404);

    const userCoords = req.user?.location?.coordinates;
    return sendSuccess(res, serializeServicePublic(service, userCoords), 'Service details');
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service listing not found', 404);

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('You are not authorized to update this service listing', 403);
    }

    Object.assign(service, req.body);
    await service.save();

    return sendSuccess(res, serializeServicePublic(service), 'Service updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service listing not found', 404);

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('You are not authorized to delete this service listing', 403);
    }

    await Service.deleteOne({ _id: id });
    return sendSuccess(res, null, 'Service listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const publishService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service listing not found', 404);

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403);
    }

    service.status = 'published';
    await service.save();

    return sendSuccess(res, serializeServicePublic(service), 'Service published');
  } catch (error) {
    next(error);
  }
};

export const pauseService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service listing not found', 404);

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403);
    }

    service.status = 'paused';
    await service.save();

    return sendSuccess(res, serializeServicePublic(service), 'Service paused');
  } catch (error) {
    next(error);
  }
};

export const getMyServices = async (req, res, next) => {
  try {
    const services = await Service.find({ providerId: req.user._id }).sort({ createdAt: -1 });
    const serialized = services.map((s) => serializeServicePublic(s));
    return sendSuccess(res, serialized, 'Provider services retrieved');
  } catch (error) {
    next(error);
  }
};


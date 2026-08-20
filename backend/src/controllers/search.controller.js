import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { AIService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { serializeServicePublic, serializeProductPublic } from '../utils/serializers.js';
import { calculateDistanceKm } from '../utils/geo.utils.js';

export const searchMarketplace = async (req, res, next) => {
  try {
    const {
      q,
      category,
      city,
      minPrice,
      maxPrice,
      minRating,
      language,
      mode,
      lat,
      lng,
      maxDistanceKm,
      type = 'services',
    } = req.query;

    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const userCoords =
      lng && lat ? [parseFloat(lng), parseFloat(lat)] : req.user?.location?.coordinates;

    if (type === 'products') {
      const filter = { status: 'active', moderationStatus: 'approved' };
      if (category) filter.category = category;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      if (q) filter.$text = { $search: q };

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .populate('sellerId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const serialized = products.map(serializeProductPublic);
      return sendSuccess(res, serialized, 'Product search results', 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Default: Services search
    const filter = { status: 'published', moderationStatus: 'approved' };
    if (category) filter.category = category;
    if (city) filter.city = new RegExp(city, 'i');
    if (language) filter.language = language;
    if (mode) filter.mode = { $in: [mode, 'both'] };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (q) {
      filter.$text = { $search: q };
    }

    if (userCoords && maxDistanceKm) {
      const maxDistanceMeters = parseFloat(maxDistanceKm) * 1000;
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userCoords,
          },
          $maxDistance: maxDistanceMeters,
        },
      };
    }

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('providerId')
      .skip(skip)
      .limit(limit);

    const serialized = services.map((s) => serializeServicePublic(s, userCoords));

    return sendSuccess(res, serialized, 'Service search results', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const aiSearch = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return sendSuccess(res, [], 'Empty query');
    }

    // Step 1: Extract structured filters via AI
    const aiParsed = await AIService.parseNaturalLanguageSearch(query);
    const filters = aiParsed.structuredFilters;

    const mongoFilter = { status: 'published', moderationStatus: 'approved' };

    if (filters.category) mongoFilter.category = filters.category;
    if (filters.language) mongoFilter.language = filters.language;
    if (filters.city) mongoFilter.city = new RegExp(filters.city, 'i');
    if (filters.mode) mongoFilter.mode = { $in: [filters.mode, 'both'] };
    if (filters.maxPrice) mongoFilter.price = { $lte: filters.maxPrice };

    const services = await Service.find(mongoFilter).populate('providerId').limit(15);

    const userCoords = req.user?.location?.coordinates || [80.2707, 13.0827];

    const results = services.map((service) => {
      const matchReasons = [];

      if (filters.language && service.language === filters.language) {
        matchReasons.push(`Language match: ${service.language.toUpperCase()}`);
      }
      if (filters.maxPrice && service.price <= filters.maxPrice) {
        matchReasons.push(`Within budget: ₹${service.price}`);
      }
      if (service.rating >= 4.5) {
        matchReasons.push(`High rating: ${service.rating}★ (${service.reviewCount} reviews)`);
      }

      if (service.location?.coordinates?.length === 2) {
        const [sLng, sLat] = service.location.coordinates;
        const [uLng, uLat] = userCoords;
        const dist = calculateDistanceKm(uLat, uLng, sLat, sLng);
        if (dist <= 10) {
          matchReasons.push(`Nearby location (~${dist} km away)`);
        }
      }

      if (matchReasons.length === 0) {
        matchReasons.push('Relevant search result');
      }

      return {
        service: serializeServicePublic(service, userCoords),
        matchReasons,
      };
    });

    return sendSuccess(
      res,
      {
        query,
        extractedFilters: filters,
        results,
      },
      'AI Search completed'
    );
  } catch (error) {
    next(error);
  }
};


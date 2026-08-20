import { calculateDistanceKm } from './geo.utils.js';

/**
 * Public user DTO serializer stripping exact residential address & coordinates.
 * @param {object} userDoc
 * @param {[number, number]} [userLocationCoords] - [lng, lat]
 */
export function serializeUserPublic(userDoc, userLocationCoords) {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;

  let approxDistanceKm = null;
  if (userLocationCoords && user.location?.coordinates?.length === 2) {
    const [userLng, userLat] = userLocationCoords;
    const [providerLng, providerLat] = user.location.coordinates;
    approxDistanceKm = calculateDistanceKm(userLat, userLng, providerLat, providerLng);
  }

  return {
    id: user._id,
    name: user.name || 'SilverHands Provider',
    role: user.role,
    profileImage: user.profileImage || '',
    preferredLanguage: user.preferredLanguage || 'en',
    city: user.city || '',
    locality: user.locality || '',
    approximateDistanceKm: approxDistanceKm,
    verificationStatus: {
      mobileVerified: user.verificationStatus?.mobileVerified || false,
      identityVerified: user.verificationStatus?.identityVerified || false,
      experienceVerified: user.verificationStatus?.experienceVerified || false,
    },
    seniorMode: user.seniorMode || false,
    createdAt: user.createdAt,
  };
}

/**
 * Public service DTO serializer stripping sensitive coordinates.
 * @param {object} serviceDoc
 * @param {[number, number]} [userLocationCoords]
 */
export function serializeServicePublic(serviceDoc, userLocationCoords) {
  if (!serviceDoc) return null;
  const service = serviceDoc.toObject ? serviceDoc.toObject() : serviceDoc;

  let approxDistanceKm = null;
  if (userLocationCoords && service.location?.coordinates?.length === 2) {
    const [userLng, userLat] = userLocationCoords;
    const [serviceLng, serviceLat] = service.location.coordinates;
    approxDistanceKm = calculateDistanceKm(userLat, userLng, serviceLat, serviceLng);
  }

  const providerId = service.providerId && typeof service.providerId === 'object'
    ? service.providerId._id || service.providerId.id
    : service.providerId;

  return {
    id: service._id,
    providerId,
    provider: service.providerId && typeof service.providerId === 'object'
      ? serializeUserPublic(service.providerId, userLocationCoords)
      : service.providerId,
    providerName: service.providerId && typeof service.providerId === 'object'
      ? service.providerId.name || 'SilverHands Provider'
      : undefined,
    title: service.title,
    description: service.description,
    category: service.category,
    skills: service.skills || [],
    priceType: service.priceType,
    price: service.price,
    mode: service.mode,
    availability: service.availability || [],
    images: service.images || [],
    language: service.language,
    city: service.city || (service.providerId?.city || ''),
    locality: service.locality || (service.providerId?.locality || ''),
    approximateDistanceKm: approxDistanceKm,
    yearsOfExperience: service.yearsOfExperience,
    status: service.status,
    rating: service.rating || 5.0,
    reviewCount: service.reviewCount || 0,
    createdAt: service.createdAt,
  };
}

/**
 * Public product DTO serializer.
 * @param {object} productDoc
 */
export function serializeProductPublic(productDoc) {
  if (!productDoc) return null;
  const product = productDoc.toObject ? productDoc.toObject() : productDoc;

  return {
    id: product._id,
    seller: product.sellerId && typeof product.sellerId === 'object'
      ? serializeUserPublic(product.sellerId)
      : product.sellerId,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    deliveryOptions: product.deliveryOptions || ['delivery'],
    rating: product.rating || 5.0,
    reviewCount: product.reviewCount || 0,
    status: product.status,
    createdAt: product.createdAt,
  };
}


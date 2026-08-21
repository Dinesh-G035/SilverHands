import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  purpose: z.enum(['login', 'signup']).optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  role: z.enum(['provider', 'customer', 'admin']).optional(),
  name: z.string().optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number').optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Admin password is required'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['provider', 'customer', 'admin']).optional(),
  preferredLanguage: z.enum(['en', 'ta', 'hi', 'te', 'kn', 'mr', 'bn']).optional(),
  profileImage: z.string().url().optional().or(z.string().length(0)),
  city: z.string().optional(),
  locality: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  seniorMode: z.boolean().optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.number().min(0).optional(),
});

export const parseVoiceSchema = z.object({
  transcript: z.string().min(5, 'Transcript must be at least 5 characters'),
});

export const generateListingSchema = z.object({
  prompt: z.string().min(5, 'Prompt must be at least 5 characters long'),
});

export const suggestPriceSchema = z.object({
  category: z.string().min(1),
  yearsOfExperience: z.number().min(0),
  city: z.string().optional(),
});

export const createServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  skills: z.array(z.string()).min(1, 'At least one skill required'),
  priceType: z.enum(['hourly', 'fixed', 'per_unit']).default('hourly'),
  price: z.number().min(10, 'Price must be at least ₹10'),
  mode: z.enum(['online', 'offline', 'both']).default('offline'),
  availability: z.array(z.object({
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })).optional(),
  images: z.array(z.string()).optional(),
  language: z.enum(['en', 'ta', 'hi', 'te', 'kn', 'mr', 'bn']).default('en'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  yearsOfExperience: z.number().min(0).default(0),
});

export const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  price: z.number().min(1),
  stock: z.number().min(0).default(1),
  images: z.array(z.string()).optional(),
  deliveryOptions: z.array(z.enum(['pickup', 'delivery'])).default(['delivery']),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  bookingDate: z.string().min(1),
  timeSlot: z.string().min(1),
  durationHours: z.number().min(1).default(1),
  location: z.string().optional(),
  mode: z.enum(['online', 'offline']).default('offline'),
  notes: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'completed', 'cancelled']),
  cancellationReason: z.string().optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1).default(1),
});

export const createOrderSchema = z.object({
  deliveryAddress: z.object({
    street: z.string().optional(),
    locality: z.string().optional(),
    city: z.string().min(1),
    pincode: z.string().optional(),
    mobile: z.string().min(10),
  }),
  pickupOption: z.boolean().default(false),
});

export const createPaymentOrderSchema = z.object({
  bookingId: z.string().optional(),
  orderId: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  bookingId: z.string().optional(),
  orderId: z.string().optional(),
});

export const createReviewSchema = z.object({
  targetType: z.enum(['service', 'product']),
  serviceId: z.string().optional(),
  productId: z.string().optional(),
  bookingId: z.string().optional(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3),
});

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  text: z.string().min(1),
});

export const createReportSchema = z.object({
  targetType: z.enum(['user', 'service', 'product', 'review', 'message']),
  targetId: z.string().min(1),
  reason: z.string().min(3),
  description: z.string().optional(),
});


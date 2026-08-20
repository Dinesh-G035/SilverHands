import { Booking } from '../models/Booking.js';
import { Service } from '../models/Service.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const createBooking = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    const {
      serviceId,
      bookingDate,
      timeSlot,
      durationHours,
      location,
      mode,
      notes,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service || service.status !== 'published') {
      throw new AppError('Service listing is not available for booking', 404);
    }

    const requestedDate = new Date(bookingDate);
    if (isNaN(requestedDate.getTime()) || requestedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      throw new AppError('Cannot create a booking for a past date/time.', 400);
    }

    const estimatedPrice = service.priceType === 'hourly'
      ? service.price * (durationHours || 1)
      : service.price;

    const booking = await Booking.create({
      serviceId: service._id,
      customerId,
      providerId: service.providerId,
      bookingDate: requestedDate,
      timeSlot,
      durationHours: durationHours || 1,
      location: location || service.locality || '',
      mode: mode || service.mode || 'offline',
      estimatedPrice,
      notes: notes || '',
      status: 'requested',
    });

    // Create notification for provider
    await Notification.create({
      userId: service.providerId,
      title: 'New Service Booking Request',
      message: `Customer ${req.user.name || 'User'} requested booking for "${service.title}" on ${requestedDate.toDateString()} (${timeSlot}).`,
      type: 'booking_request',
      link: `/bookings/${booking._id}`,
    });

    return sendSuccess(res, booking, 'Booking request sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const filter = {};

    if (req.query.role === 'provider' || req.query.role === 'customer') {
      filter[req.query.role === 'provider' ? 'providerId' : 'customerId'] = userId;
    } else if (req.user.role === 'provider') {
      filter.providerId = userId;
    } else if (req.user.role === 'customer') {
      filter.customerId = userId;
    } else {
      filter.customerId = userId;
    }

    if (req.query.status) filter.status = req.query.status;

    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('customerId', 'name mobile city locality profileImage')
      .populate('providerId', 'name mobile city locality profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return sendSuccess(res, bookings, 'Bookings retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('serviceId')
      .populate('customerId', 'name mobile city locality profileImage')
      .populate('providerId', 'name mobile city locality profileImage');

    if (!booking) throw new AppError('Booking not found', 404);

    const isCustomer = booking.customerId._id.toString() === req.user._id.toString();
    const isProvider = booking.providerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      throw new AppError('Unauthorized access to booking', 403);
    }

    return sendSuccess(res, booking, 'Booking details');
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) throw new AppError('Booking not found', 404);

    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    const isProvider = booking.providerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      throw new AppError('Unauthorized to update this booking', 403);
    }

    // Overlap conflict check before acceptance
    if (status === 'accepted') {
      if (!isProvider && !isAdmin) {
        throw new AppError('Only the provider can accept a booking request.', 403);
      }

      const existingOverlap = await Booking.findOne({
        _id: { $ne: booking._id },
        providerId: booking.providerId,
        bookingDate: booking.bookingDate,
        timeSlot: booking.timeSlot,
        status: 'accepted',
      });

      if (existingOverlap) {
        throw new AppError('You already have an accepted booking for this exact time slot.', 409);
      }
    }

    if (status === 'cancelled') {
      booking.cancellationReason = cancellationReason || 'Cancelled by user';
      booking.cancelledBy = req.user._id;
    }

    booking.status = status;
    await booking.save();

    // Create Notification
    const recipientId = isCustomer ? booking.providerId : booking.customerId;
    await Notification.create({
      userId: recipientId,
      title: `Booking ${status.toUpperCase()}`,
      message: `Your booking status has been updated to "${status}".`,
      type: 'booking_update',
      link: `/bookings/${booking._id}`,
    });

    return sendSuccess(res, booking, `Booking status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};


import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Service } from '../src/models/Service.js';
import { User } from '../src/models/User.js';

let providerToken;
let customerToken;
let serviceId;

beforeAll(async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  await connectDB();
  await request(app).post('/api/v1/auth/send-otp').send({ email: 'provider.booking@example.com' });

  // Create Provider
  const pRes = await request(app)
    .post('/api/v1/auth/verify-otp')
    .send({ email: 'provider.booking@example.com', mobile: '9876543210', otp: '123456', role: 'provider' });
  providerToken = pRes.body.data.accessToken;

  await request(app).post('/api/v1/auth/send-otp').send({ email: 'customer.booking@example.com' });

  // Create Customer
  const cRes = await request(app)
    .post('/api/v1/auth/verify-otp')
    .send({ email: 'customer.booking@example.com', mobile: '9123456789', otp: '123456', role: 'customer' });
  customerToken = cRes.body.data.accessToken;

  const providerDoc = await User.findOne({ email: 'provider.booking@example.com' });

  // Create Service
  const service = await Service.create({
    providerId: providerDoc._id,
    title: 'Tamil Cooking Class',
    description: 'Learn authentic home cooking',
    category: 'Cooking',
    skills: ['Traditional Tamil Cooking'],
    price: 400,
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2707, 13.0827] },
    status: 'published',
  });
  serviceId = service._id.toString();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Booking & Conflict Management API Tests', () => {
  let bookingId;
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  it('POST /api/v1/bookings - should create a service booking request', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        serviceId,
        bookingDate: tomorrow,
        timeSlot: '10:00 - 11:00',
        durationHours: 2,
        notes: 'Test booking',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('requested');
    bookingId = res.body.data._id;
  });

  it('PATCH /api/v1/bookings/:id/status - should accept booking', async () => {
    const res = await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'accepted' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('accepted');
  });

  it('POST /api/v1/bookings - should reject booking request if date is in the past', async () => {
    const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        serviceId,
        bookingDate: pastDate,
        timeSlot: '10:00 - 11:00',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('past date');
  });
});

import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let customerToken;

beforeAll(async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  await connectDB();
  await request(app).post('/api/v1/auth/send-otp').send({ email: 'customer.payment@example.com' });

  const cRes = await request(app)
    .post('/api/v1/auth/verify-otp')
    .send({ email: 'customer.payment@example.com', mobile: '9123456789', otp: '123456', role: 'customer' });
  customerToken = cRes.body.data.accessToken;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Razorpay Payment & Webhook API Tests', () => {
  it('POST /api/v1/payments/create-order - should reject a missing booking', async () => {
    const res = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ bookingId: '66bc59871234567890abcdef' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/payments/verify - should reject invalid HMAC signature', async () => {
    const res = await request(app)
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        razorpayOrderId: 'order_12345',
        razorpayPaymentId: 'pay_12345',
        razorpaySignature: 'invalid_signature_hash',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('verification failed');
  });
});

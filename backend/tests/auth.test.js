import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

beforeAll(async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Auth & Session Module API Tests', () => {
  let accessToken;
  let refreshToken;
  const testEmail = 'test.provider@example.com';

  it('POST /api/v1/auth/send-otp - should send OTP to email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({ email: testEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.mockOtp).toBe('123456');
  });

  it('POST /api/v1/auth/verify-otp - should authenticate user & return JWT tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({
        email: testEmail,
        mobile: '9876543210',
        otp: '123456',
        role: 'provider',
        name: 'Test Provider',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('GET /api/v1/users/profile - should fetch current authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('provider');
    expect(res.body.data.mobileVerified).toBe(undefined); // Sanitized in public DTO
  });

  it('POST /api/v1/auth/refresh-token - should rotate tokens cleanly', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /api/v1/auth/logout - should log out current session', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/auth/send-otp - should reject duplicate email during signup', async () => {
    const res = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({ email: testEmail, purpose: 'signup' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Duplicate value entered for email. Please use another value.');
  });

  it('POST /api/v1/auth/verify-otp - should reject duplicate mobile values', async () => {
    await request(app)
      .post('/api/v1/auth/send-otp')
      .send({ email: 'another.provider@example.com' });

    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ email: 'another.provider@example.com', mobile: '9876543210', otp: '123456', role: 'provider' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Duplicate value entered for mobile. Please use another value.');
  });

  it('POST /api/v1/auth/admin-login - should authenticate an admin with email and password', async () => {
    await User.create({
      email: 'security.admin@example.com',
      name: 'Security Admin',
      role: 'admin',
      passwordHash: await bcrypt.hash('correct-password', 10),
    });

    const res = await request(app)
      .post('/api/v1/auth/admin-login')
      .send({ email: 'security.admin@example.com', password: 'correct-password' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.role).toBe('admin');
  });
});

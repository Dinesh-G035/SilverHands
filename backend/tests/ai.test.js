import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let token;

beforeAll(async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  await connectDB();
  await request(app).post('/api/v1/auth/send-otp').send({ email: 'provider.ai@example.com' });

  const res = await request(app)
    .post('/api/v1/auth/verify-otp')
    .send({ email: 'provider.ai@example.com', mobile: '9876543210', otp: '123456', role: 'provider' });

  token = res.body.data.accessToken;
});

afterAll(async () => {
  await disconnectDB();
});

describe('AI Module API Tests', () => {
  it('POST /api/v1/ai/parse-voice-profile - should extract structured skills from voice transcript', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-voice-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transcript: 'I have been cooking traditional Tamil food for 20 years and teach women how to make homemade snacks.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.yearsOfExperience).toBe(20);
    expect(res.body.data.identifiedSkills.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/generate-listing - should return structured draft listing matching Zod schema', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-listing')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'I want to offer traditional Tamil home cooking classes on weekends.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBeDefined();
    expect(res.body.data.suggestedPriceRange).toBeDefined();
    expect(res.body.data.seniorFriendlyExplanation).toBeDefined();
  });
});

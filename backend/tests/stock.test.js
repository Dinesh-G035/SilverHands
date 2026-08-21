import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

let customerToken;
let productId;

beforeAll(async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  await connectDB();
  await request(app).post('/api/v1/auth/send-otp').send({ email: 'customer.stock@example.com' });

  const cRes = await request(app)
    .post('/api/v1/auth/verify-otp')
    .send({ email: 'customer.stock@example.com', mobile: '9123456789', otp: '123456', role: 'customer' });
  customerToken = cRes.body.data.accessToken;

  const seller = await User.create({
    email: 'seller.stock@example.com',
    mobile: '9876543210',
    name: 'Seller',
    role: 'provider',
    city: 'Chennai',
  });

  const product = await Product.create({
    sellerId: seller._id,
    title: 'Homemade Mango Pickle',
    description: 'Traditional pickle',
    category: 'Handmade Food',
    price: 250,
    stock: 2,
    status: 'active',
  });
  productId = product._id.toString();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Cart & Stock Protection API Tests', () => {
  it('POST /api/v1/cart/items - should add product to cart when stock is available', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  it('POST /api/v1/cart/items - should reject adding quantity greater than available stock', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId, quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('stock');
  });

  it('POST /api/v1/orders/checkout - should create order capturing priceAtPurchase snapshot', async () => {
    const res = await request(app)
      .post('/api/v1/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        deliveryAddress: {
          city: 'Chennai',
          mobile: '9123456789',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.data.items[0].priceAtPurchase).toBe(250);
    expect(res.body.data.totalAmount).toBe(500);
  });
});

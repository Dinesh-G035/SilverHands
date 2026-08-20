import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SilverHands API Documentation',
      version: '1.0.0',
      description:
        'AI-powered livelihood platform backend API for senior citizens and homemakers in India. Supports voice onboarding, AI skill parsing, marketplace search, Razorpay payments, bookings, cart, orders, and trust moderation.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local Development Server (v1 API)',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server (legacy alias)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);


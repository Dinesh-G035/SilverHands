import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { rawBodyMiddleware } from './middleware/rawBody.middleware.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import v1Router from './routes/v1/index.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Logging middleware
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request ID middleware
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('x-request-id', reqId);
  next();
});

// Global Rate Limiting
app.use('/api', globalLimiter);

// Express Body Parsers with Raw Body preservation for Razorpay webhook verification
app.use(
  express.json({
    verify: rawBodyMiddleware,
  })
);
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check endpoints
app.get(['/health', '/api/health', '/api/v1/health'], (_req, res) => {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', v1Router);
app.use('/api', v1Router); // Alias for backward compatibility

// 404 Handler
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Cannot find endpoint ${req.originalUrl} on this server. Refer to /api/docs for API documentation.`,
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;



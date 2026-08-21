import app from './app.js';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { User } from './models/User.js';

const provisionAdminAccount = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before starting the server.');
  }

  const email = env.ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.role !== 'admin') {
    throw new Error(`Configured admin email is already registered as ${existingUser.role}.`);
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await User.updateOne(
    { email },
    {
      $set: {
        role: 'admin',
        passwordHash,
        isActive: true,
        'verificationStatus.emailVerified': true,
      },
      $setOnInsert: {
        email,
        name: 'Platform Administrator',
      },
    },
    { upsert: true }
  );

  logger.info(`Admin account provisioned for ${email}.`);
};

const startServer = async () => {
  try {
    await connectDB();
    await provisionAdminAccount();

    const server = app.listen(env.PORT, () => {
      logger.info(`=======================================================`);
      logger.info(`🚀 SilverHands Backend Server running on port ${env.PORT}`);
      logger.info(`🌐 Environment: ${env.NODE_ENV}`);
      logger.info(`📚 Swagger Docs: http://localhost:${env.PORT}/api/docs`);
      logger.info(`=======================================================`);
    });

    // Express emits listen failures on the Server instance, not the async startup call.
    server.once('error', async (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${env.PORT} is already in use. Stop the existing server or set PORT to another value in .env.`);
      } else {
        logger.error(`HTTP server failed to start: ${error.message}`);
      }
      await disconnectDB();
      process.exit(1);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

import app from './app.js';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { User } from './models/User.js';

const provisionAdminAccount = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before starting the server.');
  }

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.role !== 'admin') {
    throw new Error(`Configured admin email is already registered as ${existingUser.role}.`);
  }

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
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

    const port = parseInt(process.env.PORT || '5000', 10);
    const server = app.listen(port, () => {
      logger.info(`=======================================================`);
      logger.info(`🚀 SilverHands Backend Server running on port ${port}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV}`);
      logger.info(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
      logger.info(`=======================================================`);
    });

    // Express emits listen failures on the Server instance, not the async startup call.
    server.once('error', async (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use. Stop the existing server or set PORT to another value in .env.`);
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

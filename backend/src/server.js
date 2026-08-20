import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedDatabase } from './scripts/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed initial dynamic records if database is fresh/empty
    await seedDatabase(false).catch((err) => {
      logger.warn(`Auto-seed note: ${err.message}`);
    });

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

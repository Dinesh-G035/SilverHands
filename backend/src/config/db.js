import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let mongodInstance = null;

/**
 * Establishes database connection with strict fallback policy.
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async () => {
  const isTest = env.NODE_ENV === 'test';
  const useInMemory = env.USE_IN_MEMORY_DB || isTest;

  let uriToConnect = env.MONGODB_URI;

  if (useInMemory) {
    logger.info('USE_IN_MEMORY_DB or NODE_ENV=test enabled. Launching MongoMemoryServer...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      uriToConnect = mongodInstance.getUri();
      logger.info(`MongoMemoryServer started at ${uriToConnect}`);
    } catch (err) {
      logger.error(`Failed to start MongoMemoryServer: ${err.message}`);
      throw err;
    }
  }

  if (!uriToConnect) {
    logger.error('CRITICAL: MONGODB_URI is not defined in environment configuration!');
    logger.error('Startup aborted. Please provide a valid MONGODB_URI or set USE_IN_MEMORY_DB=true for demo/test mode.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uriToConnect, {
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error(`Failed to connect to MongoDB at ${uriToConnect}: ${error.message}`);
    if (!useInMemory) {
      logger.error('================================================================');
      logger.error('ERROR: Could not establish connection to external MongoDB instance.');
      logger.error('Options:');
      logger.error('1. Start a local MongoDB service on mongodb://127.0.0.1:27017');
      logger.error('2. Set MONGODB_URI in backend/.env to your MongoDB Atlas connection string');
      logger.error('3. Set USE_IN_MEMORY_DB=true in backend/.env for zero-dependency demo mode');
      logger.error('================================================================');
      if (env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    }
    throw error;
  }
};

/**
 * Cleanly disconnects database connections.
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};


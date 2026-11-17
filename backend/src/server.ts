import { createApp } from './app.js';
import { config } from './config/index.js';
import { getDatabase } from './database/db.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    // 1. Initialize SQLite database
    getDatabase();

    // 2. Instantiate Express application
    const app = createApp();

    // 3. Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info('========================================================');
      logger.info(`  AI Knowledge Inbox Backend running on port ${config.port}`);
      logger.info(`  Environment: ${config.nodeEnv}`);
      logger.info(`  Health Check: http://localhost:${config.port}/health`);
      logger.info('========================================================');
    });

    // Graceful shutdown handling
    const shutdown = () => {
      logger.info('Shutting down AI Knowledge Inbox backend server...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

bootstrap();

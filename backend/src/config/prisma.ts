import { PrismaClient } from '../generated/prisma/client';
import { logger } from 'patal-log';
import { env } from './env';

const SLOW_QUERY_THRESHOLD = process.env.NODE_ENV === 'production' ? 1000 : 500;
const ENABLE_DETAILED_LOGGING = process.env.NODE_ENV !== 'production';

// Production और development के लिए अलग-अलग configuration
const prismaClientOptions: any = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || env.DATABASE_URL
    }
  },
  // Development में ही query logs enable करें
  log: ENABLE_DETAILED_LOGGING ? [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' }
  ] : [
    { level: 'error', emit: 'event' }
  ],
  // ─── MOST IMPORTANT FIX ───
  // Increase default timeouts for transactions
  transactionOptions: {
    maxWait: 15000,     // Max wait time to acquire transaction slot (15 seconds)
    timeout: 60000,     // Max time a transaction can run (60 seconds) — safe for bulk ops
  },
};

// Connection timeout and pool settings
if (process.env.NODE_ENV === 'production') {
  prismaClientOptions.datasources.db.url += '&connect_timeout=30&pool_timeout=60';
}

const basePrisma = new PrismaClient(prismaClientOptions);

// Production-ready logging with Prisma Client extensions
const prisma = basePrisma.$extends({
  query: {
    async $allOperations({ model, operation, args, query }) {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      
      try {
        const result = await query(args);
        const duration = Date.now() - startTime;
        
        // Development में ही detailed logs
        if (ENABLE_DETAILED_LOGGING) {
          const now = new Date();
          const formattedTime = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
          });
          
          console.log(`[${formattedTime}] [SQL] ${model ? model + '.' : ''}${operation} - ${duration}ms`);
          
          if (duration > SLOW_QUERY_THRESHOLD) {
            console.warn(`⚠️ SLOW QUERY: ${duration}ms - ${model ? model + '.' : ''}${operation}`);
          }
        }
        
        // Production में केवल slow queries और errors log करें
        if (duration > SLOW_QUERY_THRESHOLD) {
          logger.warn('Slow database query detected', {
            functionName: 'prisma.query',
            metadata: {
              model: model || 'unknown',
              operation,
              duration: `${duration}ms`,
              timestamp,
              threshold: `${SLOW_QUERY_THRESHOLD}ms`
            }
          });
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Production में errors log करें
        logger.error('Database operation failed', {
          functionName: 'prisma.query',
          metadata: {
            model: model || 'unknown',
            operation,
            duration: `${duration}ms`,
            timestamp,
            error: error instanceof Error ? {
              message: error.message,
              name: error.name,
              stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            } : String(error)
          }
        });
        
        // Development में console में भी दिखाएं
        if (ENABLE_DETAILED_LOGGING) {
          console.error(`❌ [SQL ERROR] ${model ? model + '.' : ''}${operation}: ${error instanceof Error ? error.message : String(error)}`);
          console.error(`Duration: ${duration}ms`);
        }
        
        throw error;
      }
    },
  },
});

// Event-based logging (Prisma 3.x/4.x compatible)
if (ENABLE_DETAILED_LOGGING) {
  basePrisma.$on('query' as never, (e: any) => {
    const duration = e.duration;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
    
    console.log(`[${formattedTime}] [QUERY] ${e.query} - ${duration}ms`);
    
    if (duration > SLOW_QUERY_THRESHOLD) {
      console.warn(`⚠️ SLOW QUERY DETECTED: ${duration}ms`);
    }
  });

  basePrisma.$on('error' as never, (e: any) => {
    console.error(`❌ [PRISMA ERROR] ${e.message}`);
  });
}

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    // Simple query to check connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    return { healthy: true, result };
  } catch (error) {
    logger.error('Database health check failed', {
      functionName: 'checkDatabaseHealth',
      metadata: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
    return { healthy: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Improved Connection retry logic
export const connectWithRetry = async (maxRetries = 5, baseDelay = 2000) => {
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Database connection attempt ${attempt}`, {
        functionName: 'connectWithRetry',
        metadata: { 
          attempt, 
          maxRetries,
          databaseUrl: process.env.DATABASE_URL || env.DATABASE_URL
        }
      });
      
      // Try to connect
      await prisma.$connect();
      
      // Check if connection is actually healthy
      const healthCheck = await checkDatabaseHealth();
      
      if (healthCheck.healthy) {
        logger.info('Database connected successfully', {
          functionName: 'connectWithRetry',
          metadata: { 
            attempt,
            totalAttempts: attempt
          }
        });
        return true;
      } else {
        lastError = new Error(`Health check failed: ${healthCheck.error}`);
        await prisma.$disconnect();
      }
    } catch (error) {
      lastError = error;
      logger.warn(`Database connection attempt ${attempt} failed`, {
        functionName: 'connectWithRetry',
        metadata: {
          attempt,
          maxRetries,
          error: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      });
      
      if (attempt === maxRetries) {
        logger.error('Max retry attempts reached', {
          functionName: 'connectWithRetry',
          metadata: { 
            maxRetries,
            finalError: lastError instanceof Error ? lastError.message : String(lastError)
          }
        });
        throw new Error(`DatabaseConnectionFailed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000;
      logger.info(`Retrying in ${Math.round((delay + jitter)/1000)} seconds...`, {
        functionName: 'connectWithRetry',
        metadata: { delay: delay + jitter }
      });
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  return false;
};

// Initialize database connection on app start
export const initializeDatabase = async () => {
  try {
    const isConnected = await connectWithRetry();
    if (!isConnected) {
      throw new Error('Failed to connect to database after retries');
    }
    
    logger.info('Database initialized successfully', {
      functionName: 'initializeDatabase'
    });
    
    return prisma;
  } catch (error) {
    logger.error('Database initialization failed', {
      functionName: 'initializeDatabase',
      metadata: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
    
    // Don't crash the app in development
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      console.warn('⚠️  Running without database connection (development mode)');
      return prisma;
    }
  }
};

// Graceful shutdown
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected gracefully', {
      functionName: 'disconnectPrisma'
    });
  } catch (error) {
    logger.error('Error disconnecting from database', {
      functionName: 'disconnectPrisma',
      metadata: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
  }
};

export { prisma };
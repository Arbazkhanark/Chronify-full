// src/server.ts
import { env } from "./config/env";
import { logger } from "patal-log";
import { prisma, checkDatabaseHealth, connectWithRetry } from "./config/prisma";
import app from "./app";

// Development banner
if (process.env.NODE_ENV === 'development') {
  console.clear();
  console.log('\x1b[44m%s\x1b[0m', ' '.repeat(80));
  console.log('\x1b[44m%s\x1b[0m', '🚀 DEV SERVER STARTING');
  console.log('\x1b[44m%s\x1b[0m', '📊 SQL Query Logging: ENABLED');
  console.log('\x1b[44m%s\x1b[0m', ' '.repeat(80));
}

// Test connection (dev only)
async function testDevConnection(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    const result = await prisma.$queryRaw`SELECT NOW() as time` as any;
    console.log('\x1b[32m%s\x1b[0m', `✅ Database connected at ${result[0].time}\n`);
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Start server
export default async function startServer(): Promise<void> {
  try {
    // Connect to database
    const connected = await connectWithRetry();
    
    if (!connected) {
      logger.error('DatabaseConnectionFailed',{
        functionName: 'startServer',
        metadata: {
          error: 'Failed to connect to database after retries'
        }
      });
      process.exit(1);
    }
    
    // Test in development
    await testDevConnection();
    
    // Start server
    const server = app.listen(env.PORT, () => {
      const mode = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD';
      console.log(`🚀 Server running on http://localhost:${env.PORT} (${mode} MODE)`);
      
      logger.info('ServerStarted', {
        functionName: 'app.listen',
        metadata: {
          port: env.PORT,
          nodeEnv: process.env.NODE_ENV,
          pid: process.pid
        }
      });
    });
    
    // Server timeouts
    server.setTimeout(30000);
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    
    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info('ShutdownSignal', { 
        functionName: 'gracefulShutdown',
        metadata: { signal }
       });
      
      server.close(async () => {
        try {
          await prisma.$disconnect();
          logger.info('ShutdownComplete',{
            functionName: 'gracefulShutdown',
          });
          process.exit(0);
        } catch (error) {
          logger.error('ShutdownError', {
            functionName: 'gracefulShutdown',
            metadata: {
              error: error instanceof Error ? error.message : String(error)
            }
          });
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('ForcedShutdown',{
          functionName: 'gracefulShutdown',
          metadata: {
            signal,
            reason: 'Shutdown timed out after 10 seconds'
          }
        });
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    logger.error('StartupError', {
      functionName: 'startServer',
      metadata: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
    process.exit(1);
  }
}

// Global error handlers
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('UnhandledRejection', {
    functionName: 'process.unhandledRejection',
    metadata:{
      reason: reason instanceof Error ? reason.message : String(reason)
    }
  });
});

process.on('uncaughtException', async (error: Error) => {
  logger.error('UncaughtException', {
      functionName: 'process.uncaughtException',
      metadata:{
        error: error.message,
        stack: error.stack,
        pid: process.pid
      }
  });
  
  try {
    await prisma.$disconnect();
  } catch (disconnectError) {
    // Ignore during crash
  }
  
  process.exit(1);
});

// Start if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
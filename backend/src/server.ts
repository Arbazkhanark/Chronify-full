// //src/server.ts
// import { app } from "./app";
// import { env } from "./config/env";
// import { logger } from "patal-log";
// import { prisma } from "./config/prisma";

// export default async function startServer() {
//   try {
//     await prisma.$connect();
//     logger.info("✅ Database connected successfully", {
//       functionName: "prisma.$connect",
//     });

//     app.listen(env.PORT, () => {
//       logger.info(`🚀 Server running on http://localhost:${env.PORT}`, {
//         functionName: "server.listen",
//         metadata: { port: env.PORT },
//       });
//     });
//   } catch (error) {
//     logger.error("❌ Database connection failed", {
//       functionName: "prisma.$connect",
//       metadata:{
//         error: error instanceof Error ? error.message : String(error),
//       }
//     });
//     process.exit(1);
//   }
// }

// startServer();
















// // src/server.ts
// import { app } from "./app";
// import { env } from "./config/env";
// import { logger } from "patal-log";
// import { prisma } from "./config/prisma";

// // Health check function
// async function checkDatabaseHealth(): Promise<boolean> {
//   try {
//     const startTime = Date.now();
//     await prisma.$queryRaw`SELECT 1`;
//     const duration = Date.now() - startTime;
    
//     logger.info("Database health check passed", {
//       functionName: "checkDatabaseHealth",
//       metadata: {
//         duration,
//         timestamp: new Date().toISOString()
//       }
//     });
    
//     return true;
//   } catch (error) {
//     logger.error("Database health check failed", {
//       functionName: "checkDatabaseHealth",
//       metadata: {
//         error: error instanceof Error ? error.message : String(error)
//       }
//     });
//     return false;
//   }
// }

// // Retry connection with exponential backoff
// async function retryConnection(attempt: number = 1): Promise<void> {
//   const maxAttempts = 5;
//   const baseDelay = 1000; // 1 second
  
//   if (attempt > maxAttempts) {
//     logger.error("Max retry attempts reached, exiting...", {
//       functionName: "retryConnection",
//       metadata: { maxAttempts }
//     });
//     process.exit(1);
//   }
  
//   const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
//   const jitter = Math.random() * 1000; // Add jitter
  
//   logger.info(`Retrying database connection (attempt ${attempt}/${maxAttempts})`, {
//     functionName: "retryConnection",
//     metadata: { attempt, maxAttempts, delay: delay + jitter }
//   });
  
//   await new Promise(resolve => setTimeout(resolve, delay + jitter));
  
//   try {
//     await prisma.$connect();
//     const isHealthy = await checkDatabaseHealth();
    
//     if (isHealthy) {
//       logger.info("Database reconnected successfully", {
//         functionName: "retryConnection",
//         metadata: { attempt }
//       });
//       startServer();
//     } else {
//       await retryConnection(attempt + 1);
//     }
//   } catch (error) {
//     logger.error(`Connection attempt ${attempt} failed`, {
//       functionName: "retryConnection",
//       metadata: {
//         attempt,
//         error: error instanceof Error ? error.message : String(error)
//       }
//     });
//     await retryConnection(attempt + 1);
//   }
// }

// export default async function startServer() {
//   try {
//     // Connect to database
//     await prisma.$connect();
    
//     // Verify connection with health check
//     const isHealthy = await checkDatabaseHealth();
    
//     if (!isHealthy) {
//       throw new Error("Database health check failed");
//     }
    
//     logger.info("✅ Database connected successfully", {
//       functionName: "startServer",
//       metadata: {
//         nodeEnv: process.env.NODE_ENV,
//         port: env.PORT,
//         database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
//       }
//     });

//     app.listen(env.PORT, () => {
//       logger.info(`🚀 Server running on http://localhost:${env.PORT}`, {
//         functionName: "app.listen",
//         metadata: { 
//           port: env.PORT,
//           nodeEnv: process.env.NODE_ENV,
//           pid: process.pid
//         }
//       });
//     });
//   } catch (error) {
//     logger.error("❌ Initial database connection failed", {
//       functionName: "startServer",
//       metadata: {
//         error: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : undefined
//       }
//     });
    
//     // Start retry logic
//     await retryConnection();
//   }
// }

// // Global error handlers
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Promise Rejection', {
//     functionName: 'process.unhandledRejection',
//     metadata: {
//       reason: reason instanceof Error ? reason.message : String(reason),
//       stack: reason instanceof Error ? reason.stack : undefined
//     }
//   });
  
//   // In production, we might want to restart or notify
//   if (process.env.NODE_ENV === 'production') {
//     // Optionally restart the process after cleanup
//     setTimeout(() => {
//       logger.info("Restarting after unhandled rejection...",{
//         functionName: 'process.unhandledRejection',
//       });
//       process.exit(1);
//     }, 1000);
//   }
// });

// process.on('uncaughtException', async (error) => {
//   logger.error('Uncaught Exception', {
//     functionName: 'process.uncaughtException',
//     metadata: {
//       error: error.message,
//       stack: error.stack,
//       pid: process.pid
//     }
//   });
  
//   // Attempt graceful shutdown
//   try {
//     await prisma.$disconnect();
//     logger.info("Prisma disconnected during uncaught exception",{
//       functionName: 'process.uncaughtException',
//     });
//   } catch (disconnectError) {
//     logger.error("Failed to disconnect Prisma", {
//       functionName: 'process.uncaughtException',
//       metadata: {
//         error: disconnectError instanceof Error ? disconnectError.message : String(disconnectError)
//       }
//     });
//   }
  
//   // Exit with failure code
//   process.exit(1);
// });

// // Start the server
// if (process.env.NODE_ENV !== 'test') {
//   startServer();
// }





































// // src/server.ts
// import { app } from "./app";
// import { env } from "./config/env";
// import { logger } from "patal-log";
// import { prisma } from "./config/prisma";

// // Test function to verify queries are showing
// async function testDatabaseQueries() {
//   if (process.env.NODE_ENV === 'development') {
//     console.log('\x1b[42m%s\x1b[0m', '🔍 Testing Database Queries in DEV Mode...');
    
//     try {
//       // Test 1: Raw query
//       console.log('\x1b[33m%s\x1b[0m', '\n1. Testing Raw Query:');
//       const rawResult = await prisma.$queryRaw`SELECT 1 as test_value, NOW() as current_time`;
//       console.log('Raw Query Result:', rawResult);
      
//       // Test 2: If you have any model (uncomment and adjust)
//       /*
//       console.log('\x1b[33m%s\x1b[0m', '\n2. Testing Model Query:');
//       const modelResult = await prisma.user.findMany({
//         take: 1,
//         select: { id: true, email: true }
//       });
//       console.log('Model Query Result:', modelResult);
//       */
      
//       console.log('\x1b[32m%s\x1b[0m', '✅ Database query test completed!\n');
//     } catch (error) {
//       console.error('❌ Database test failed:', error);
//     }
//   }
// }

// // Health check function
// async function checkDatabaseHealth(): Promise<boolean> {
//   try {
//     const startTime = Date.now();
//     await prisma.$queryRaw`SELECT 1`;
//     const duration = Date.now() - startTime;
    
//     logger.info("Database health check passed", {
//       functionName: "checkDatabaseHealth",
//       metadata: {
//         duration,
//         timestamp: new Date().toISOString()
//       }
//     });
    
//     return true;
//   } catch (error) {
//     logger.error("Database health check failed", {
//       functionName: "checkDatabaseHealth",
//       metadata: {
//         error: error instanceof Error ? error.message : String(error)
//       }
//     });
//     return false;
//   }
// }

// // Retry connection with exponential backoff
// async function retryConnection(attempt: number = 1): Promise<void> {
//   const maxAttempts = 5;
//   const baseDelay = 1000; // 1 second
  
//   if (attempt > maxAttempts) {
//     logger.error("Max retry attempts reached, exiting...", {
//       functionName: "retryConnection",
//       metadata: { maxAttempts }
//     });
//     process.exit(1);
//   }
  
//   const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
//   const jitter = Math.random() * 1000; // Add jitter
  
//   logger.info(`Retrying database connection (attempt ${attempt}/${maxAttempts})`, {
//     functionName: "retryConnection",
//     metadata: { attempt, maxAttempts, delay: delay + jitter }
//   });
  
//   await new Promise(resolve => setTimeout(resolve, delay + jitter));
  
//   try {
//     await prisma.$connect();
//     const isHealthy = await checkDatabaseHealth();
    
//     if (isHealthy) {
//       logger.info("Database reconnected successfully", {
//         functionName: "retryConnection",
//         metadata: { attempt }
//       });
//       startServer();
//     } else {
//       await retryConnection(attempt + 1);
//     }
//   } catch (error) {
//     logger.error(`Connection attempt ${attempt} failed`, {
//       functionName: "retryConnection",
//       metadata: {
//         attempt,
//         error: error instanceof Error ? error.message : String(error)
//       }
//     });
//     await retryConnection(attempt + 1);
//   }
// }

// export default async function startServer() {
//   try {
//     console.log('\x1b[44m%s\x1b[0m', `🚀 Starting server in ${process.env.NODE_ENV || env.NODE_ENV} mode`);
    
//     // Connect to database
//     await prisma.$connect();
    
//     // Verify connection with health check
//     const isHealthy = await checkDatabaseHealth();
    
//     if (!isHealthy) {
//       throw new Error("Database health check failed");
//     }
    
//     logger.info("✅ Database connected successfully", {
//       functionName: "startServer",
//       metadata: {
//         nodeEnv: process.env.NODE_ENV,
//         port: env.PORT,
//         database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown',
//         showQueries: process.env.NODE_ENV === 'development' ? 'YES' : 'NO'
//       }
//     });
    
//     // Development में test queries run करें
//     await testDatabaseQueries();

//     const server = app.listen(env.PORT, () => {
//       logger.info(`🚀 Server running on http://localhost:${env.PORT}`, {
//         functionName: "app.listen",
//         metadata: { 
//           port: env.PORT,
//           nodeEnv: process.env.NODE_ENV,
//           pid: process.pid,
//           queryLogging: process.env.NODE_ENV === 'development' ? 'ENABLED' : 'DISABLED'
//         }
//       });
      
//       // Development में helpful message
//       if (process.env.NODE_ENV === 'development') {
//         console.log('\x1b[42m%s\x1b[0m', '📊 SQL QUERIES WILL BE SHOWN IN CONSOLE 📊');
//         console.log('\x1b[36m%s\x1b[0m', 'To disable query logging, set NODE_ENV=production\n');
//       }
//     });
    
//     // Server timeouts
//     server.setTimeout(30000);
//     server.keepAliveTimeout = 65000;
//     server.headersTimeout = 66000;
    
//   } catch (error) {
//     logger.error("❌ Initial database connection failed", {
//       functionName: "startServer",
//       metadata: {
//         error: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : undefined
//       }
//     });
    
//     // Start retry logic
//     await retryConnection();
//   }
// }

// // Global error handlers
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Promise Rejection', {
//     functionName: 'process.unhandledRejection',
//     metadata: {
//       reason: reason instanceof Error ? reason.message : String(reason),
//       stack: reason instanceof Error ? reason.stack : undefined
//     }
//   });
  
//   // In production, we might want to restart or notify
//   if (process.env.NODE_ENV === 'production') {
//     // Optionally restart the process after cleanup
//     setTimeout(() => {
//       logger.info("Restarting after unhandled rejection...",{
//         functionName: 'process.unhandledRejection',
//       });
//       process.exit(1);
//     }, 1000);
//   }
// });

// process.on('uncaughtException', async (error) => {
//   logger.error('Uncaught Exception', {
//     functionName: 'process.uncaughtException',
//     metadata: {
//       error: error.message,
//       stack: error.stack,
//       pid: process.pid
//     }
//   });
  
//   // Attempt graceful shutdown
//   try {
//     await prisma.$disconnect();
//     logger.info("Prisma disconnected during uncaught exception",{
//       functionName: 'process.uncaughtException',
//     });
//   } catch (disconnectError) {
//     logger.error("Failed to disconnect Prisma", {
//       functionName: 'process.uncaughtException',
//       metadata: {
//         error: disconnectError instanceof Error ? disconnectError.message : String(disconnectError)
//       }
//     });
//   }
  
//   // Exit with failure code
//   process.exit(1);
// });

// // Start the server
// if (process.env.NODE_ENV !== 'test') {
//   startServer();
// }






































import { app } from "./app";
import { env } from "./config/env";
import { logger } from "patal-log";
import { prisma, checkDatabaseHealth, connectWithRetry } from "./config/prisma";

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
// src/routes/health.ts
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { logger } from 'patal-log';

const router = Router();

/**
 * Helper function to check database health
 */
async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  duration: number;
  timestamp: string;
  message?: string;
  error?: string;
}> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1 as health_check`;
    const duration = Date.now() - startTime;
    
    return {
      healthy: true,
      duration,
      timestamp,
      message: 'Database is responding normally'
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return {
      healthy: false,
      duration,
      timestamp,
      error: error instanceof Error ? error.message : 'Database connection failed',
      message: 'Failed to connect to database'
    };
  }
}

/**
 * Database health check endpoint
 */
router.get('/db', async (req, res) => {
  const startTime = Date.now();
  
  logger.info('Database health check requested', {
    functionName: 'health/db',
    metadata: {
      endpoint: '/db',
      method: req.method,
      clientIp: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      traceId: req.headers['x-trace-id'] || 'none'
    }
  });
  
  try {
    logger.debug('Processing health check request', {
      functionName: 'health/db',
      metadata: {
        stage: 'processing',
        timestamp: new Date().toISOString()
      }
    });
    
    const healthResult = await checkDatabaseHealth();
    const totalDuration = Date.now() - startTime;
    
    if (healthResult.healthy) {
      logger.info('Database health check completed successfully', {
        functionName: 'health/db',
        metadata: {
          status: 'healthy',
          responseTime: totalDuration,
          dbCheckDuration: healthResult.duration,
          timestamp: new Date().toISOString(),
          clientIp: req.ip
        }
      });
      
      res.json({
        status: 'healthy',
        timestamp: healthResult.timestamp,
        database: 'connected',
        message: 'Database is responding normally',
        metrics: {
          totalResponseTime: totalDuration + 'ms',
          databaseCheckTime: healthResult.duration + 'ms',
          uptime: process.uptime() + 's'
        }
      });
    } else {
      logger.error('Database health check failed', {
        functionName: 'health/db',
        metadata: {
          status: 'unhealthy',
          responseTime: totalDuration,
          dbCheckDuration: healthResult.duration,
          timestamp: new Date().toISOString(),
          error: healthResult.error,
          clientIp: req.ip
        }
      });
      
      res.status(503).json({
        status: 'unhealthy',
        timestamp: healthResult.timestamp,
        database: 'disconnected',
        error: healthResult.error || 'Database connection failed',
        message: healthResult.message || 'Health check failed',
        metrics: {
          totalResponseTime: totalDuration + 'ms',
          databaseCheckTime: healthResult.duration + 'ms'
        }
      });
    }
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    logger.error('Health check system error', {
      functionName: 'health/db',
      metadata: {
        endpoint: '/db',
        timestamp: new Date().toISOString(),
        responseTime: totalDuration,
        clientIp: req.ip,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      }
    });
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check system failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      metrics: {
        totalResponseTime: totalDuration + 'ms'
      }
    });
  }
});

/**
 * Server information endpoint
 */
router.get('/info', (req, res) => {
  logger.debug('Server info requested', {
    functionName: 'health/info',
    metadata: {
      endpoint: '/info',
      clientIp: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
  
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'study-buddy-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    metrics: {
      uptime: process.uptime() + 's',
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
      },
      cpuUsage: process.cpuUsage()
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      cwd: process.cwd()
    }
  });
});

/**
 * Simple ping endpoint
 */
router.get('/ping', (req, res) => {
  const startTime = Date.now();
  
  logger.debug('Ping request received', {
    functionName: 'health/ping',
    metadata: {
      endpoint: '/ping',
      clientIp: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      traceId: req.headers['x-trace-id'] || 'none'
    }
  });
  
  const responseTime = Date.now() - startTime;
  
  logger.debug('Ping response sent', {
    functionName: 'health/ping',
    metadata: {
      endpoint: '/ping',
      responseTime,
      timestamp: new Date().toISOString(),
      clientIp: req.ip
    }
  });
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'pong',
    service: 'study-buddy-api',
    metrics: {
      responseTime: responseTime + 'ms'
    }
  });
});

/**
 * Route list endpoint
 */
router.get('/routes', (req, res) => {
  logger.info('Route list requested', {
    functionName: 'health/routes',
    metadata: {
      clientIp: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
  
  const routes = router.stack
    .filter(layer => layer.route)
    .map(layer => ({
      path: layer.route?.path || 'unknown',
      methods: Object.keys(layer.route || {}).filter(m => m !== '_all'),
      middlewareCount: layer.route?.stack.length || 0
    }));
  
  // Get all available health endpoints
  const healthEndpoints = routes.map(route => ({
    endpoint: `/v0/api/health${route.path}`,
    methods: route.methods,
    description: getEndpointDescription(route.path)
  }));
  
  logger.debug('Route list generated', {
    functionName: 'health/routes',
    metadata: {
      totalRoutes: routes.length,
      timestamp: new Date().toISOString()
    }
  });
  
  res.json({
    timestamp: new Date().toISOString(),
    service: 'study-buddy-api',
    apiVersion: 'v0',
    basePath: '/v0/api',
    healthEndpoints: healthEndpoints,
    metrics: {
      totalEndpoints: healthEndpoints.length,
      uptime: process.uptime() + 's'
    }
  });
});

/**
 * Database statistics endpoint
 */
router.get('/db-stats', async (req, res) => {
  const startTime = Date.now();
  
  logger.info('Database statistics requested', {
    functionName: 'health/db-stats',
    metadata: {
      endpoint: '/db-stats',
      clientIp: req.ip,
      timestamp: new Date().toISOString()
    }
  });
  
  try {
    // Get database statistics (using parameterized query)
    const tableStats = await prisma.$queryRaw`
      SELECT 
        schemaname as schema,
        tablename as table,
        tableowner as owner,
        hasindexes as has_indexes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    const totalDuration = Date.now() - startTime;
    
    logger.info('Database statistics retrieved', {
      functionName: 'health/db-stats',
      metadata: {
        tablesCount: Array.isArray(tableStats) ? tableStats.length : 0,
        responseTime: totalDuration,
        timestamp: new Date().toISOString()
      }
    });
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'postgresql',
        schema: 'public',
        statistics: {
          tables: Array.isArray(tableStats) ? tableStats.length : 0,
          tablesList: tableStats
        }
      },
      metrics: {
        responseTime: totalDuration + 'ms'
      }
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    logger.error('Database statistics failed', {
      functionName: 'health/db-stats',
      metadata: {
        endpoint: '/db-stats',
        timestamp: new Date().toISOString(),
        responseTime: totalDuration,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Failed to retrieve database statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
      metrics: {
        responseTime: totalDuration + 'ms'
      }
    });
  }
});

/**
 * System status endpoint
 */
router.get('/status', async (req, res) => {
  const startTime = Date.now();
  
  logger.info('System status check requested', {
    functionName: 'health/status',
    metadata: {
      endpoint: '/status',
      clientIp: req.ip,
      timestamp: new Date().toISOString()
    }
  });
  
  try {
    // Check multiple system components
    const [dbHealth, memoryUsage, uptime] = await Promise.all([
      checkDatabaseHealth().catch(() => ({ 
        healthy: false, 
        duration: 0,
        timestamp: new Date().toISOString(),
        message: 'Database check failed',
        error: 'Connection timeout'
      })),
      Promise.resolve(process.memoryUsage()),
      Promise.resolve(process.uptime())
    ]);
    
    const totalDuration = Date.now() - startTime;
    
    const systemStatus = {
      database: dbHealth.healthy ? 'healthy' : 'unhealthy',
      memory: memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9 ? 'healthy' : 'warning',
      uptime: uptime > 60 ? 'healthy' : 'starting' // More than 1 minute
    };
    
    const overallStatus = dbHealth.healthy ? 'healthy' : 'degraded';
    
    logger.info('System status check completed', {
      functionName: 'health/status',
      metadata: {
        overallStatus,
        components: systemStatus,
        responseTime: totalDuration,
        timestamp: new Date().toISOString()
      }
    });
    
    res.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      system: 'study-buddy-api',
      components: systemStatus,
      metrics: {
        uptime: uptime + 's',
        responseTime: totalDuration + 'ms',
        databaseCheckTime: dbHealth.duration + 'ms',
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) + '%'
        }
      }
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    logger.error('System status check failed', {
      functionName: 'health/status',
      metadata: {
        endpoint: '/status',
        timestamp: new Date().toISOString(),
        responseTime: totalDuration,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'System status check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      metrics: {
        responseTime: totalDuration + 'ms'
      }
    });
  }
});

// Helper function to get endpoint descriptions
function getEndpointDescription(endpoint: string): string {
  const descriptions: Record<string, string> = {
    '/db': 'Check database connectivity and health status',
    '/info': 'Get server information and system metrics',
    '/ping': 'Simple ping endpoint for connectivity testing',
    '/routes': 'List all available health endpoints',
    '/db-stats': 'Get database statistics and table information',
    '/status': 'Get comprehensive system status with all components'
  };
  
  return descriptions[endpoint] || 'Health monitoring endpoint';
}

// console.log('Health routes initialized with 6 endpoints at /v0/api/health'); // Simple console log for initialization
// logger.info('Health routes initialized', {
//   functionName: 'health/init',
//   metadata: {
//     totalEndpoints: 6,
//     basePath: '/v0/api/health',
//     timestamp: new Date().toISOString()
//   }
// });

export default router;
import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/config/container';
import { ICache } from '../../domain/repositories/ICache';
import { ILogger } from '../../domain/services/ILogger';
import { config } from '../../../config/env/config';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  responseTime?: number;
  lastChecked: string;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: HealthCheck[];
}

// // @injectable()
export class HealthCheckService {
  private startTime: number = Date.now();
  private cache: ICache;
  private logger: ILogger;

  constructor(cache: ICache, logger: ILogger) {
    this.cache = cache;
    this.logger = logger;
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheck[] = [];

    // Check API connectivity
    const apiCheck = await this.checkApiConnectivity();
    checks.push(apiCheck);

    // Check cache
    const cacheCheck = await this.checkCache();
    checks.push(cacheCheck);

    // Check memory usage
    const memoryCheck = this.checkMemoryUsage();
    checks.push(memoryCheck);

    // Determine overall status
    const overallStatus = this.determineOverallStatus(checks);

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.NODE_ENV,
      uptime: Date.now() - this.startTime,
      checks,
    };

    this.logger.info('Health check completed', { status: overallStatus, checks: checks.length });

    return result;
  }

  private async checkApiConnectivity(): Promise<HealthCheck> {
    const start = Date.now();

    try {
      const response = await fetch(`${config.NEXT_PUBLIC_API_URL}/chapters`, {
        method: 'HEAD',
        timeout: config.API_TIMEOUT,
      } as any);

      const responseTime = Date.now() - start;

      if (response.ok) {
        return {
          name: 'api_connectivity',
          status: responseTime > 5000 ? 'degraded' : 'healthy',
          responseTime,
          lastChecked: new Date().toISOString(),
          message: responseTime > 5000 ? 'API response time is slow' : 'API is responsive',
        };
      } else {
        return {
          name: 'api_connectivity',
          status: 'unhealthy',
          responseTime,
          lastChecked: new Date().toISOString(),
          message: `API returned ${response.status} ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        name: 'api_connectivity',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: `API connectivity failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private async checkCache(): Promise<HealthCheck> {
    const start = Date.now();
    const testKey = 'health_check_test';
    const testValue = { timestamp: Date.now() };

    try {
      // Test cache write
      await this.cache.set(testKey, testValue, 10);

      // Test cache read
      const retrieved = await this.cache.get(testKey);

      // Clean up test data
      await this.cache.remove(testKey);

      const responseTime = Date.now() - start;

      if (retrieved && JSON.stringify(retrieved) === JSON.stringify(testValue)) {
        return {
          name: 'cache',
          status: responseTime > 1000 ? 'degraded' : 'healthy',
          responseTime,
          lastChecked: new Date().toISOString(),
          message:
            responseTime > 1000 ? 'Cache response time is slow' : 'Cache is working properly',
        };
      } else {
        return {
          name: 'cache',
          status: 'unhealthy',
          responseTime,
          lastChecked: new Date().toISOString(),
          message: 'Cache read/write test failed',
        };
      }
    } catch (error) {
      return {
        name: 'cache',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: `Cache check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private checkMemoryUsage(): HealthCheck {
    const start = Date.now();

    try {
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);

        const usagePercent = (usedMB / limitMB) * 100;

        return {
          name: 'memory_usage',
          status: usagePercent > 80 ? 'degraded' : usagePercent > 90 ? 'unhealthy' : 'healthy',
          responseTime: Date.now() - start,
          lastChecked: new Date().toISOString(),
          message: `Memory usage: ${usedMB}MB / ${limitMB}MB (${usagePercent.toFixed(1)}%)`,
        };
      } else {
        return {
          name: 'memory_usage',
          status: 'healthy',
          responseTime: Date.now() - start,
          lastChecked: new Date().toISOString(),
          message: 'Memory usage monitoring not available in this environment',
        };
      }
    } catch (error) {
      return {
        name: 'memory_usage',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private determineOverallStatus(checks: HealthCheck[]): 'healthy' | 'unhealthy' | 'degraded' {
    if (checks.some((check) => check.status === 'unhealthy')) {
      return 'unhealthy';
    } else if (checks.some((check) => check.status === 'degraded')) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }
}

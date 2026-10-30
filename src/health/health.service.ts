import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

export interface HealthReport {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  uptimeSeconds: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthReport> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error('Database health check failed', error as Error);
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        timestamp: new Date().toISOString(),
      });
    }

    return {
      status: 'ok',
      database: 'up',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

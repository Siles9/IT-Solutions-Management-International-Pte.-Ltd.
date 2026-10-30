import { Controller, Get } from '@nestjs/common';

import { HealthService, type HealthReport } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** Liveness + readiness in one call: the platform must also see the database. */
  @Get()
  check(): Promise<HealthReport> {
    return this.healthService.check();
  }
}

import { Injectable } from '@nestjs/common';

import type { ExperienceModel } from '../../database/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import type { ExperienceRepository } from './experience.repository';
import type { CreateExperienceData } from './experience.types';

@Injectable()
export class PrismaExperienceRepository implements ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileIds(profileIds: readonly string[]): Promise<Map<string, ExperienceModel[]>> {
    const rows = await this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });

    const grouped = new Map<string, ExperienceModel[]>(
      profileIds.map((profileId) => [profileId, []]),
    );

    for (const row of rows) {
      grouped.get(row.profileId)?.push(row);
    }

    return grouped;
  }

  async create(profileId: string, data: CreateExperienceData): Promise<ExperienceModel> {
    // New entries are appended after the curated ones; ordering is owned by the database
    // so that concurrent inserts do not interleave unpredictably.
    const aggregate = await this.prisma.experience.aggregate({
      where: { profileId },
      _max: { sortOrder: true },
    });

    return this.prisma.experience.create({
      data: {
        profileId,
        ...data,
        sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
      },
    });
  }
}

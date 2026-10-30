import { Injectable } from '@nestjs/common';

import type { SkillModel } from '../../database/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import type { SkillRepository } from './skill.repository';
import type { AttachSkillData, ProfileSkillView, SkillFilter } from './skill.types';

@Injectable()
export class PrismaSkillRepository implements SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(filter: SkillFilter): Promise<SkillModel[]> {
    return this.prisma.skill.findMany({
      where: filter.category ? { category: filter.category } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findSkillsByProfileIds(
    profileIds: readonly string[],
  ): Promise<Map<string, ProfileSkillView[]>> {
    const rows = await this.prisma.profileSkill.findMany({
      where: { profileId: { in: [...profileIds] } },
      include: { skill: true },
      orderBy: [{ sortOrder: 'asc' }, { skill: { name: 'asc' } }],
    });

    const grouped = new Map<string, ProfileSkillView[]>(
      profileIds.map((profileId) => [profileId, []]),
    );

    for (const row of rows) {
      grouped.get(row.profileId)?.push({
        ...row.skill,
        level: row.level,
        yearsOfExperience: row.yearsOfExperience,
      });
    }

    return grouped;
  }

  async findSkillsByProjectIds(projectIds: readonly string[]): Promise<Map<string, SkillModel[]>> {
    const rows = await this.prisma.projectSkill.findMany({
      where: { projectId: { in: [...projectIds] } },
      include: { skill: true },
      orderBy: [{ projectId: 'asc' }, { skill: { name: 'asc' } }],
    });

    const grouped = new Map<string, SkillModel[]>(projectIds.map((projectId) => [projectId, []]));

    for (const row of rows) {
      grouped.get(row.projectId)?.push(row.skill);
    }

    return grouped;
  }

  /**
   * Catalogue entry and join row are written in one transaction. Adding a skill that
   * already exists updates its level instead of failing on the primary key.
   */
  attachToProfile(profileId: string, data: AttachSkillData): Promise<ProfileSkillView> {
    return this.prisma.$transaction(async (transaction) => {
      const skill = await transaction.skill.upsert({
        where: { name: data.name },
        create: { name: data.name, category: data.category },
        update: {},
      });

      const aggregate = await transaction.profileSkill.aggregate({
        where: { profileId },
        _max: { sortOrder: true },
      });

      const link = await transaction.profileSkill.upsert({
        where: { profileId_skillId: { profileId, skillId: skill.id } },
        create: {
          profileId,
          skillId: skill.id,
          level: data.level,
          yearsOfExperience: data.yearsOfExperience,
          sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
        },
        update: {
          level: data.level,
          yearsOfExperience: data.yearsOfExperience,
        },
      });

      return {
        ...skill,
        level: link.level,
        yearsOfExperience: link.yearsOfExperience,
      };
    });
  }
}

import { Injectable } from '@nestjs/common';

import { Prisma, SkillCategory } from '../../database/prisma-client';
import type { ProjectModel } from '../../database/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import type { ProjectRepository } from './project.repository';
import type { CreateProjectData } from './project.types';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileIds(profileIds: readonly string[]): Promise<Map<string, ProjectModel[]>> {
    const rows = await this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });

    const grouped = new Map<string, ProjectModel[]>(profileIds.map((id) => [id, []]));

    for (const row of rows) {
      grouped.get(row.profileId)?.push(row);
    }

    return grouped;
  }

  async slugExists(slug: string): Promise<boolean> {
    const found = await this.prisma.project.findUnique({ where: { slug }, select: { id: true } });
    return found !== null;
  }

  async create(profileId: string, data: CreateProjectData): Promise<ProjectModel> {
    const aggregate = await this.prisma.project.aggregate({
      where: { profileId },
      _max: { sortOrder: true },
    });

    return this.prisma.project.create({
      data: {
        profileId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        url: data.url,
        repositoryUrl: data.repositoryUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        featured: data.featured,
        sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
        // Reuse a catalogue entry when the name exists, create it otherwise.
        technologies: {
          create: data.technologies.map((name) => ({
            skill: {
              connectOrCreate: {
                where: { name },
                create: { name, category: SkillCategory.TOOL },
              },
            },
          })),
        },
      },
    });
  }
}

export function isUniqueConstraintViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

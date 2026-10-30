import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SkillCategory } from '../prisma-client';
import { PrismaService } from '../prisma.service';
import {
  PRIMARY_PROFILE_SLUG,
  seedExperience,
  seedProfile,
  seedProjects,
  seedSkills,
} from './seed-data';

export type SeedResult = 'seeded' | 'skipped';

/**
 * Fills the database on startup.
 *
 * Seed runs only when the profile is missing, inside a transaction guarded by an advisory
 * lock. Restarts and parallel instances are safe, and data edited through the API is not
 * overwritten.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('SEED_ON_START') === 'false') {
      this.logger.log('Automatic seeding is disabled (SEED_ON_START=false)');
      return;
    }

    const result = await this.seedIfNeeded();

    if (result === 'seeded') {
      this.logger.log(`Seed data for profile "${PRIMARY_PROFILE_SLUG}" has been created`);
    } else {
      this.logger.log('Seed skipped: profile already exists');
    }
  }

  /** Inserts data only when the profile is missing. */
  seedIfNeeded(): Promise<SeedResult> {
    return this.insertSeedData({ replace: false });
  }

  /** Drops the profile and inserts it again from seed-data.ts. */
  reseed(): Promise<SeedResult> {
    return this.insertSeedData({ replace: true });
  }

  private async insertSeedData({ replace }: { replace: boolean }): Promise<SeedResult> {
    return this.prisma.$transaction(
      async (transaction) => {
        await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('business-card:seed'))`;

        if (replace) {
          await transaction.profile.deleteMany({ where: { slug: PRIMARY_PROFILE_SLUG } });
        }

        const existing = await transaction.profile.findUnique({
          where: { slug: PRIMARY_PROFILE_SLUG },
          select: { id: true },
        });

        if (existing) {
          return 'skipped';
        }

        await transaction.profile.create({
          data: {
            ...seedProfile,
            isPrimary: true,
          },
        });

        // Skills are shared, match them by name instead of creating duplicates.
        await transaction.skill.createMany({
          data: seedSkills.map(({ name, category }) => ({ name, category })),
          skipDuplicates: true,
        });

        const catalogue = await transaction.skill.findMany({
          where: { name: { in: seedSkills.map((skill) => skill.name) } },
          select: { id: true, name: true },
        });
        const skillIdByName = new Map(catalogue.map((skill) => [skill.name, skill.id]));

        await transaction.profileSkill.createMany({
          data: seedSkills.map((skill, index) => {
            const skillId = skillIdByName.get(skill.name);

            if (!skillId) {
              throw new Error(`Seed skill "${skill.name}" was not persisted`);
            }

            return {
              profileId: seedProfile.id,
              skillId,
              level: skill.level,
              yearsOfExperience: skill.yearsOfExperience,
              sortOrder: index,
            };
          }),
          skipDuplicates: true,
        });

        await transaction.experience.createMany({
          data: seedExperience.map((experience, index) => ({
            id: experience.id,
            profileId: seedProfile.id,
            company: experience.company,
            position: experience.position,
            startDate: new Date(experience.startDate),
            endDate: experience.endDate ? new Date(experience.endDate) : null,
            summary: experience.summary,
            achievements: experience.achievements,
            sortOrder: index,
          })),
        });

        for (const [index, project] of seedProjects.entries()) {
          await transaction.project.create({
            data: {
              id: project.id,
              profileId: seedProfile.id,
              slug: project.slug,
              name: project.name,
              description: project.description,
              url: project.url,
              repositoryUrl: project.repositoryUrl,
              startDate: new Date(project.startDate),
              endDate: project.endDate ? new Date(project.endDate) : null,
              featured: project.featured,
              sortOrder: index,
              technologies: {
                create: project.technologies.map((name) => ({
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

        return 'seeded';
      },
      { timeout: 30_000 },
    );
  }
}

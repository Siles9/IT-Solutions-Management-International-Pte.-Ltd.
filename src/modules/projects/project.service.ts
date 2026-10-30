import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';

import type { ProjectModel } from '../../database/prisma-client';
import { slugify } from '../../common/utils/slugify';
import { ProfileService } from '../profile/profile.service';
import type { AddProjectInput } from './dto/add-project.input';
import { isUniqueConstraintViolation } from './prisma-project.repository';
import { PROJECT_REPOSITORY, type ProjectRepository } from './project.repository';

const MAX_SLUG_ATTEMPTS = 20;

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly repository: ProjectRepository,
    private readonly profileService: ProfileService,
  ) {}

  async addProject(input: AddProjectInput): Promise<ProjectModel> {
    const endDate = input.endDate ?? null;

    if (endDate && input.startDate && endDate < input.startDate) {
      throw new BadRequestException('endDate must not be earlier than startDate');
    }

    const profile = await this.profileService.getPrimary();
    const slug = await this.buildUniqueSlug(input);

    try {
      return await this.repository.create(profile.id, {
        name: input.name.trim(),
        slug,
        description: input.description?.trim() ?? null,
        url: input.url ?? null,
        repositoryUrl: input.repositoryUrl ?? null,
        startDate: input.startDate ?? null,
        endDate,
        featured: input.featured ?? false,
        technologies: deduplicate(input.technologies ?? []),
      });
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(`Project with slug "${slug}" already exists`);
      }
      throw error;
    }
  }

  private async buildUniqueSlug(input: AddProjectInput): Promise<string> {
    const requested = input.slug ?? slugify(input.name);

    if (!requested) {
      throw new BadRequestException(
        'Could not derive a slug from the name; provide an explicit `slug`',
      );
    }

    if (!(await this.repository.slugExists(requested))) {
      return requested;
    }

    for (let suffix = 2; suffix <= MAX_SLUG_ATTEMPTS; suffix += 1) {
      const candidate = `${requested}-${suffix}`;
      if (!(await this.repository.slugExists(candidate))) {
        return candidate;
      }
    }

    throw new ConflictException(`Could not allocate a unique slug for "${input.name}"`);
  }
}

function deduplicate(values: string[]): string[] {
  const trimmed = values.map((value) => value.trim()).filter(Boolean);
  return [...new Set(trimmed)];
}

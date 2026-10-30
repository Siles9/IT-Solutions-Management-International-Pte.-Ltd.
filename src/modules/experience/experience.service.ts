import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { ExperienceModel } from '../../database/prisma-client';
import { ProfileService } from '../profile/profile.service';
import type { AddExperienceInput } from './dto/add-experience.input';
import { EXPERIENCE_REPOSITORY, type ExperienceRepository } from './experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY) private readonly repository: ExperienceRepository,
    private readonly profileService: ProfileService,
  ) {}

  async addExperience(input: AddExperienceInput): Promise<ExperienceModel> {
    const endDate = input.endDate ?? null;

    if (endDate && endDate < input.startDate) {
      throw new BadRequestException('endDate must not be earlier than startDate');
    }

    const profile = await this.profileService.getPrimary();

    return this.repository.create(profile.id, {
      company: input.company.trim(),
      position: input.position.trim(),
      startDate: input.startDate,
      endDate,
      summary: input.summary?.trim() ?? null,
      achievements: input.achievements?.map((item) => item.trim()).filter(Boolean) ?? [],
    });
  }
}

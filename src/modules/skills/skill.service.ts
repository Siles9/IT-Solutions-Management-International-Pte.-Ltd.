import { Inject, Injectable } from '@nestjs/common';

import { SkillLevel, type SkillModel } from '../../database/prisma-client';
import { ProfileService } from '../profile/profile.service';
import type { AddSkillInput } from './dto/add-skill.input';
import { SKILL_REPOSITORY, type SkillRepository } from './skill.repository';
import type { ProfileSkillView, SkillFilter } from './skill.types';

@Injectable()
export class SkillService {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly repository: SkillRepository,
    private readonly profileService: ProfileService,
  ) {}

  list(filter: SkillFilter = {}): Promise<SkillModel[]> {
    return this.repository.findMany(filter);
  }

  async addSkill(input: AddSkillInput): Promise<ProfileSkillView> {
    const profile = await this.profileService.getPrimary();

    return this.repository.attachToProfile(profile.id, {
      name: input.name.trim(),
      category: input.category,
      level: input.level ?? SkillLevel.INTERMEDIATE,
      yearsOfExperience: input.yearsOfExperience ?? null,
    });
  }
}

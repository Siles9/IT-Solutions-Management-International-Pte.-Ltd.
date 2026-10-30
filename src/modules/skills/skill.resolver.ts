import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MutationApiKeyGuard } from '../../common/guards/mutation-api-key.guard';
import type { SkillModel } from '../../database/prisma-client';
import { AddSkillInput } from './dto/add-skill.input';
import { SkillFilterInput } from './dto/skill-filter.input';
import { Skill } from './entities/skill.entity';
import { SkillService } from './skill.service';
import type { ProfileSkillView, SkillFilter } from './skill.types';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [Skill], {
    name: 'skills',
    description: 'The whole skill catalogue, optionally filtered by category.',
  })
  skills(
    @Args('filter', { type: () => SkillFilterInput, nullable: true }) filter?: SkillFilterInput,
  ): Promise<SkillModel[]> {
    const criteria: SkillFilter = filter?.category ? { category: filter.category } : {};
    return this.skillService.list(criteria);
  }

  @Mutation(() => Skill, {
    name: 'addSkill',
    description:
      'Attaches a skill to the primary profile. Re-adding an existing skill updates the level.',
  })
  @UseGuards(MutationApiKeyGuard)
  addSkill(
    @Args('input', { type: () => AddSkillInput }) input: AddSkillInput,
  ): Promise<ProfileSkillView> {
    return this.skillService.addSkill(input);
  }
}

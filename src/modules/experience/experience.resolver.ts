import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import type { ExperienceModel } from '../../database/prisma-client';
import { MutationApiKeyGuard } from '../../common/guards/mutation-api-key.guard';
import { AddExperienceInput } from './dto/add-experience.input';
import { Experience } from './entities/experience.entity';
import { ExperienceService } from './experience.service';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Mutation(() => Experience, {
    name: 'addExperience',
    description: 'Appends a position to the primary profile.',
  })
  @UseGuards(MutationApiKeyGuard)
  addExperience(
    @Args('input', { type: () => AddExperienceInput }) input: AddExperienceInput,
  ): Promise<ExperienceModel> {
    return this.experienceService.addExperience(input);
  }

  @ResolveField(() => Boolean, {
    description: 'Computed field: no end date means the person still works there.',
  })
  isCurrent(@Parent() experience: ExperienceModel): boolean {
    return experience.endDate === null;
  }
}

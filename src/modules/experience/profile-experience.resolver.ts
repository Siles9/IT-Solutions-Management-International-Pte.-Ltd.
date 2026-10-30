import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import type { ExperienceModel, ProfileModel } from '../../database/prisma-client';
import type { GraphQLContext } from '../../graphql/graphql.context';
import { Profile } from '../profile/entities/profile.entity';
import { Experience } from './entities/experience.entity';

/** `Profile.experience` goes through the loader: one query for all profiles in a request. */
@Resolver(() => Profile)
export class ProfileExperienceResolver {
  @ResolveField('experience', () => [Experience], {
    description: 'Work history, newest first.',
  })
  experience(
    @Parent() profile: ProfileModel,
    @Context() context: GraphQLContext,
  ): Promise<ExperienceModel[]> {
    return context.loaders.experienceByProfileId.load(profile.id);
  }
}

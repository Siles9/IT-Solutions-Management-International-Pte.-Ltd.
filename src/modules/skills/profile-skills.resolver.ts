import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import type { ProfileModel } from '../../database/prisma-client';
import type { GraphQLContext } from '../../graphql/graphql.context';
import { Profile } from '../profile/entities/profile.entity';
import { Skill } from './entities/skill.entity';
import type { ProfileSkillView } from './skill.types';

@Resolver(() => Profile)
export class ProfileSkillsResolver {
  @ResolveField('skills', () => [Skill], {
    description: 'Skills attached to the profile, in curated order.',
  })
  skills(
    @Parent() profile: ProfileModel,
    @Context() context: GraphQLContext,
  ): Promise<ProfileSkillView[]> {
    return context.loaders.skillsByProfileId.load(profile.id);
  }
}

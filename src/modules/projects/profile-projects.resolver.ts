import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import type { ProfileModel, ProjectModel } from '../../database/prisma-client';
import type { GraphQLContext } from '../../graphql/graphql.context';
import { Profile } from '../profile/entities/profile.entity';
import { Project } from './entities/project.entity';

@Resolver(() => Profile)
export class ProfileProjectsResolver {
  @ResolveField('projects', () => [Project], { description: 'Portfolio projects, featured first.' })
  projects(
    @Parent() profile: ProfileModel,
    @Context() context: GraphQLContext,
  ): Promise<ProjectModel[]> {
    return context.loaders.projectsByProfileId.load(profile.id);
  }
}

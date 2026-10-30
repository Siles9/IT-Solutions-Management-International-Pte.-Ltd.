import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import type { ProjectModel, SkillModel } from '../../database/prisma-client';
import type { GraphQLContext } from '../../graphql/graphql.context';
import { Project } from '../projects/entities/project.entity';
import { Skill } from './entities/skill.entity';

/**
 * `Project.technologies` lives in the skills module because skills own the catalogue.
 * A DataLoader collects every project of the operation into a single batched query.
 */
@Resolver(() => Project)
export class ProjectTechnologiesResolver {
  @ResolveField('technologies', () => [Skill], { description: 'Technologies used in the project.' })
  technologies(
    @Parent() project: ProjectModel,
    @Context() context: GraphQLContext,
  ): Promise<SkillModel[]> {
    return context.loaders.technologiesByProjectId.load(project.id);
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MutationApiKeyGuard } from '../../common/guards/mutation-api-key.guard';
import type { ProjectModel } from '../../database/prisma-client';
import { AddProjectInput } from './dto/add-project.input';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project, {
    name: 'addProject',
    description: 'Adds a project to the primary profile and links its technologies.',
  })
  @UseGuards(MutationApiKeyGuard)
  addProject(
    @Args('input', { type: () => AddProjectInput }) input: AddProjectInput,
  ): Promise<ProjectModel> {
    return this.projectService.addProject(input);
  }
}

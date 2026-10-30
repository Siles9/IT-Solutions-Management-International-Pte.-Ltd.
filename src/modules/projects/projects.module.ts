import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile/profile.module';
import { PrismaProjectRepository } from './prisma-project.repository';
import { ProfileProjectsResolver } from './profile-projects.resolver';
import { PROJECT_REPOSITORY } from './project.repository';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [ProfileModule],
  providers: [
    ProjectService,
    ProjectResolver,
    ProfileProjectsResolver,
    PrismaProjectRepository,
    { provide: PROJECT_REPOSITORY, useExisting: PrismaProjectRepository },
  ],
  exports: [ProjectService, PROJECT_REPOSITORY],
})
export class ProjectsModule {}

import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile/profile.module';
import { ExperienceResolver } from './experience.resolver';
import { EXPERIENCE_REPOSITORY } from './experience.repository';
import { ExperienceService } from './experience.service';
import { PrismaExperienceRepository } from './prisma-experience.repository';
import { ProfileExperienceResolver } from './profile-experience.resolver';

@Module({
  imports: [ProfileModule],
  providers: [
    ExperienceService,
    ExperienceResolver,
    ProfileExperienceResolver,
    PrismaExperienceRepository,
    { provide: EXPERIENCE_REPOSITORY, useExisting: PrismaExperienceRepository },
  ],
  exports: [ExperienceService, EXPERIENCE_REPOSITORY],
})
export class ExperienceModule {}

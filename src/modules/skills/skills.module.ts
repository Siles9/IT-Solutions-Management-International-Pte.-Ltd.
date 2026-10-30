import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile/profile.module';
import { PrismaSkillRepository } from './prisma-skill.repository';
import { ProfileSkillsResolver } from './profile-skills.resolver';
import { ProjectTechnologiesResolver } from './project-technologies.resolver';
import { SKILL_REPOSITORY } from './skill.repository';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';

@Module({
  imports: [ProfileModule],
  providers: [
    SkillService,
    SkillResolver,
    ProfileSkillsResolver,
    ProjectTechnologiesResolver,
    PrismaSkillRepository,
    { provide: SKILL_REPOSITORY, useExisting: PrismaSkillRepository },
  ],
  exports: [SkillService, SKILL_REPOSITORY],
})
export class SkillsModule {}

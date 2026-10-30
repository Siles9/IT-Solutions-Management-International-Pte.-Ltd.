import { Module } from '@nestjs/common';

import { ExperienceModule } from '../modules/experience/experience.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { SkillsModule } from '../modules/skills/skills.module';
import { DataLoadersFactory } from './data-loaders.factory';

/** Batching layer between resolvers and repositories, kept out of the feature modules. */
@Module({
  imports: [SkillsModule, ExperienceModule, ProjectsModule],
  providers: [DataLoadersFactory],
  exports: [DataLoadersFactory],
})
export class DataLoadersModule {}

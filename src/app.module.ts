import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvironment } from './config/environment';
import { PrismaModule } from './database/prisma.module';
import { SeedModule } from './database/seed/seed.module';
import { ApiGraphqlModule } from './graphql/api-graphql.module';
import { HealthModule } from './health/health.module';
import { LandingModule } from './landing/landing.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SkillsModule } from './modules/skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    ApiGraphqlModule,
    ProfileModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
    HealthModule,
    LandingModule,
    SeedModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { PrismaProfileRepository } from './prisma-profile.repository';
import { PROFILE_REPOSITORY } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  providers: [
    ProfileService,
    ProfileResolver,
    PrismaProfileRepository,
    { provide: PROFILE_REPOSITORY, useExisting: PrismaProfileRepository },
  ],
  exports: [ProfileService, PROFILE_REPOSITORY],
})
export class ProfileModule {}

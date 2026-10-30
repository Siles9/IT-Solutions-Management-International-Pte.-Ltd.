import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { MutationApiKeyGuard } from '../../common/guards/mutation-api-key.guard';
import type { ProfileModel } from '../../database/prisma-client';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Profile } from './entities/profile.entity';
import { ProfileLink } from './entities/profile-link.entity';
import { buildProfileLinks } from './profile-links';
import { ProfileService } from './profile.service';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    name: 'profile',
    description: 'The primary profile that owns this business card.',
  })
  profile(): Promise<ProfileModel> {
    return this.profileService.getPrimary();
  }

  @Query(() => [Profile], {
    name: 'profiles',
    description: 'All profiles. The API is ready for a team card even though the seed has one.',
  })
  profiles(): Promise<ProfileModel[]> {
    return this.profileService.list();
  }

  @Mutation(() => Profile, {
    name: 'updateProfile',
    description: 'Partial update of the primary profile. `null` clears a nullable field.',
  })
  @UseGuards(MutationApiKeyGuard)
  updateProfile(
    @Args('input', { type: () => UpdateProfileInput }) input: UpdateProfileInput,
  ): Promise<ProfileModel> {
    return this.profileService.updatePrimary(input);
  }

  @ResolveField(() => [ProfileLink], {
    description: 'Only the professional links that are actually filled in.',
  })
  links(@Parent() profile: ProfileModel): ProfileLink[] {
    return buildProfileLinks(profile);
  }
}

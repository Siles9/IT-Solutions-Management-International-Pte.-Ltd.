import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ProfileModel } from '../../database/prisma-client';
import { pickDefined } from '../../common/utils/pick-defined';
import type { UpdateProfileInput } from './dto/update-profile.input';
import { PROFILE_REPOSITORY, type ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(@Inject(PROFILE_REPOSITORY) private readonly repository: ProfileRepository) {}

  /**
   * The business card always has an owner profile. A missing profile means the database
   * was not seeded (for example, `SEED_ON_START=false` and no manual seed).
   */
  async getPrimary(): Promise<ProfileModel> {
    const profile = await this.repository.findPrimary();

    if (!profile) {
      throw new NotFoundException(
        'Profile is not initialised yet. Start the application with SEED_ON_START=true or run `npm run db:seed`.',
      );
    }

    return profile;
  }

  list(): Promise<ProfileModel[]> {
    return this.repository.findMany();
  }

  async updatePrimary(input: UpdateProfileInput): Promise<ProfileModel> {
    const changes = pickDefined(input);

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('Provide at least one field to update');
    }

    const profile = await this.getPrimary();

    return this.repository.update(profile.id, changes);
  }
}

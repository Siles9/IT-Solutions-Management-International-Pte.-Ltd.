import type { ProfileModel } from '../../database/prisma-client';

export const PROFILE_REPOSITORY = Symbol('PROFILE_REPOSITORY');

export type ProfileUpdateData = Partial<
  Pick<
    ProfileModel,
    | 'fullName'
    | 'headline'
    | 'description'
    | 'location'
    | 'email'
    | 'avatarUrl'
    | 'githubUrl'
    | 'linkedinUrl'
    | 'telegramUrl'
    | 'websiteUrl'
  >
>;

/** Repository interface for profiles. Services depend on it, not on Prisma. */
export interface ProfileRepository {
  /** Primary profile, or any existing profile when the flag is not set. */
  findPrimary(): Promise<ProfileModel | null>;
  findMany(): Promise<ProfileModel[]>;
  update(id: string, data: ProfileUpdateData): Promise<ProfileModel>;
}

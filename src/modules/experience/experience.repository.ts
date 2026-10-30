import type { ExperienceModel } from '../../database/prisma-client';
import type { CreateExperienceData } from './experience.types';

export const EXPERIENCE_REPOSITORY = Symbol('EXPERIENCE_REPOSITORY');

export interface ExperienceRepository {
  /** Batched lookup used by the `Profile.experience` DataLoader. */
  findByProfileIds(profileIds: readonly string[]): Promise<Map<string, ExperienceModel[]>>;
  create(profileId: string, data: CreateExperienceData): Promise<ExperienceModel>;
}

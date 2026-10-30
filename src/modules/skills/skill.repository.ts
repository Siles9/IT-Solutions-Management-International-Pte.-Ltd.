import type { SkillModel } from '../../database/prisma-client';
import type { AttachSkillData, ProfileSkillView, SkillFilter } from './skill.types';

export const SKILL_REPOSITORY = Symbol('SKILL_REPOSITORY');

export interface SkillRepository {
  findMany(filter: SkillFilter): Promise<SkillModel[]>;
  /** Batched lookup used by the `Profile.skills` DataLoader. */
  findSkillsByProfileIds(profileIds: readonly string[]): Promise<Map<string, ProfileSkillView[]>>;
  /** Batched lookup used by the `Project.technologies` DataLoader. */
  findSkillsByProjectIds(projectIds: readonly string[]): Promise<Map<string, SkillModel[]>>;
  attachToProfile(profileId: string, data: AttachSkillData): Promise<ProfileSkillView>;
}

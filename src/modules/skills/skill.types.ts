import { SkillCategory, SkillLevel, type SkillModel } from '../../database/prisma-client';

/** Skill catalogue entry enriched with the per-profile metadata of `profile_skills`. */
export type ProfileSkillView = SkillModel & {
  level: SkillLevel;
  yearsOfExperience: number | null;
};

export interface SkillFilter {
  category?: SkillCategory;
}

export interface AttachSkillData {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number | null;
}

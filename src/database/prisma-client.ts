/**
 * Single import point for the generated Prisma client. The client itself is not committed,
 * `npm ci` generates it into src/generated/prisma.
 */
export { Prisma, PrismaClient, SkillCategory, SkillLevel } from '../generated/prisma/client';

export type {
  Experience as ExperienceModel,
  Profile as ProfileModel,
  ProfileSkill as ProfileSkillModel,
  Project as ProjectModel,
  ProjectSkill as ProjectSkillModel,
  Skill as SkillModel,
} from '../generated/prisma/client';

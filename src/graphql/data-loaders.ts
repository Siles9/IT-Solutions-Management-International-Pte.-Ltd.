import type DataLoader from 'dataloader';

import type { ExperienceModel, ProjectModel, SkillModel } from '../database/prisma-client';
import type { ProfileSkillView } from '../modules/skills/skill.types';

/** One loader per relation. Loaders live for a single request, see the context factory. */
export interface DataLoaders {
  readonly skillsByProfileId: DataLoader<string, ProfileSkillView[]>;
  readonly experienceByProfileId: DataLoader<string, ExperienceModel[]>;
  readonly projectsByProfileId: DataLoader<string, ProjectModel[]>;
  readonly technologiesByProjectId: DataLoader<string, SkillModel[]>;
}

/** Turns a key -> values map into the array shape DataLoader expects. */
export function toBatchResult<K, V>(keys: readonly K[], grouped: Map<K, V[]>): V[][] {
  return keys.map((key) => grouped.get(key) ?? []);
}

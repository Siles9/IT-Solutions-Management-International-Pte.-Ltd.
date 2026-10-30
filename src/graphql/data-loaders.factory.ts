import { Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import type { ProfileSkillView } from '../modules/skills/skill.types';
import {
  EXPERIENCE_REPOSITORY,
  type ExperienceRepository,
} from '../modules/experience/experience.repository';
import { PROJECT_REPOSITORY, type ProjectRepository } from '../modules/projects/project.repository';
import { SKILL_REPOSITORY, type SkillRepository } from '../modules/skills/skill.repository';
import { toBatchResult, type DataLoaders } from './data-loaders';

const MAX_BATCH_SIZE = 100;

/**
 * One DataLoader per relation, created for a single GraphQL operation.
 * Relations are field resolvers, so unrequested ones are never loaded, and requested ones
 * are batched into one query instead of one query per row.
 */
@Injectable()
export class DataLoadersFactory {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
    @Inject(EXPERIENCE_REPOSITORY) private readonly experienceRepository: ExperienceRepository,
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepository,
  ) {}

  create(): DataLoaders {
    return {
      skillsByProfileId: new DataLoader<string, ProfileSkillView[]>(
        async (profileIds) => {
          const grouped = await this.skillRepository.findSkillsByProfileIds(profileIds);
          return toBatchResult(profileIds, grouped);
        },
        { maxBatchSize: MAX_BATCH_SIZE },
      ),

      experienceByProfileId: new DataLoader(
        async (profileIds) => {
          const grouped = await this.experienceRepository.findByProfileIds(profileIds);
          return toBatchResult(profileIds, grouped);
        },
        { maxBatchSize: MAX_BATCH_SIZE },
      ),

      projectsByProfileId: new DataLoader(
        async (profileIds) => {
          const grouped = await this.projectRepository.findByProfileIds(profileIds);
          return toBatchResult(profileIds, grouped);
        },
        { maxBatchSize: MAX_BATCH_SIZE },
      ),

      technologiesByProjectId: new DataLoader(
        async (projectIds) => {
          const grouped = await this.skillRepository.findSkillsByProjectIds(projectIds);
          return toBatchResult(projectIds, grouped);
        },
        { maxBatchSize: MAX_BATCH_SIZE },
      ),
    };
  }
}

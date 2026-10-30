import type { ProjectModel } from '../../database/prisma-client';
import type { CreateProjectData } from './project.types';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
  /** Batched lookup used by the `Profile.projects` DataLoader. */
  findByProfileIds(profileIds: readonly string[]): Promise<Map<string, ProjectModel[]>>;
  slugExists(slug: string): Promise<boolean>;
  create(profileId: string, data: CreateProjectData): Promise<ProjectModel>;
}

export interface CreateProjectData {
  name: string;
  slug: string;
  description: string | null;
  url: string | null;
  repositoryUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  featured: boolean;
  /** Technology names; new catalogue entries are created on the fly. */
  technologies: string[];
}

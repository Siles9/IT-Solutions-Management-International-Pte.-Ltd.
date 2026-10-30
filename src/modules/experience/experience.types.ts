export interface CreateExperienceData {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  summary: string | null;
  achievements: string[];
}

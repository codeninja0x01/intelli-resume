// Experience DTOs
export interface CreateExperienceDto {
  profileId: string;
  title: string;
  company: string;
  location: string;
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  metadata?: Record<string, any>;
}

export interface UpdateExperienceDto {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  skills?: string[];
  metadata?: Record<string, any>;
}

// Experience Response DTOs
export interface ExperienceResponseDto {
  id: string;
  profileId: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  durationInMonths?: number;
  durationInYears?: number;
  formattedDuration?: string;
  isCurrentPosition?: boolean;
  isPastPosition?: boolean;
  totalResponsibilitiesCount?: number;
  totalAchievementsCount?: number;
  totalSkillsCount?: number;
}

// Experience Filter and Query Types
export interface ExperienceFilters {
  profileId?: string;
  title?: string;
  company?: string;
  location?: string;
  isCurrent?: boolean;
  isPast?: boolean;
  startDateFrom?: string | Date;
  startDateTo?: string | Date;
  endDateFrom?: string | Date;
  endDateTo?: string | Date;
  hasDescription?: boolean;
  hasResponsibilities?: boolean;
  hasAchievements?: boolean;
  hasSkills?: boolean;
  minDurationMonths?: number;
  maxDurationMonths?: number;
  search?: string; // For searching across title, company, description
}

export interface ExperienceQueryParams extends ExperienceFilters {
  page?: number;
  limit?: number;
  sortBy?: 'startDate' | 'endDate' | 'company' | 'title' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Experience Statistics
export interface ExperienceStatsDto {
  total: number;
  current: number;
  past: number;
  companies: number;
  positions: number;
  locations: number;
  totalExperienceInYears: number;
  averagePositionDurationInYears: number;
  totalResponsibilities: number;
  totalAchievements: number;
  totalSkills: number;
  uniqueSkills: number;
  mostRecentExperience?: ExperienceResponseDto;
  longestExperience?: ExperienceResponseDto;
  currentExperiences?: ExperienceResponseDto[];
  companyCounts: Record<string, number>;
  titleCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  skillsFrequency: Record<string, number>;
  yearWiseExperience: Record<string, number>;
}

// Experience Lists
export interface ExperienceListResponseDto {
  experiences: ExperienceResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: ExperienceFilters;
}

// Experience Validation Types
export interface ExperienceValidationDto {
  profileId: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  metadata?: Record<string, any>;
} 
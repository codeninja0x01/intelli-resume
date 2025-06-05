// Education DTOs
export interface CreateEducationDto {
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateEducationDto {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  metadata?: Record<string, any>;
}

// Education Response DTOs
export interface EducationResponseDto {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  durationInMonths?: number;
  durationInYears?: number;
  formattedDuration?: string;
  isCompleted?: boolean;
  isInProgress?: boolean;
}

// Education Filter and Query Types
export interface EducationFilters {
  profileId?: string;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
  startDateFrom?: string | Date;
  startDateTo?: string | Date;
  endDateFrom?: string | Date;
  endDateTo?: string | Date;
  hasGrade?: boolean;
  hasDescription?: boolean;
  hasAchievements?: boolean;
  hasSkills?: boolean;
  search?: string; // For searching across institution, degree, field of study
}

export interface EducationQueryParams extends EducationFilters {
  page?: number;
  limit?: number;
  sortBy?: 'startDate' | 'endDate' | 'institution' | 'degree' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Education Statistics
export interface EducationStatsDto {
  total: number;
  inProgress: number;
  completed: number;
  institutions: number;
  degrees: number;
  fieldsOfStudy: number;
  totalDurationInYears: number;
  averageDurationInYears: number;
  mostRecentEducation?: EducationResponseDto;
  longestEducation?: EducationResponseDto;
  institutionCounts: Record<string, number>;
  degreeCounts: Record<string, number>;
  fieldOfStudyCounts: Record<string, number>;
  gradeDistribution: Record<string, number>;
  skillsFrequency: Record<string, number>;
}

// Education Lists
export interface EducationListResponseDto {
  education: EducationResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: EducationFilters;
}

// Education Validation Types
export interface EducationValidationDto {
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  metadata?: Record<string, any>;
} 
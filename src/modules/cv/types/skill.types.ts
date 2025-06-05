// Skill DTOs
export interface CreateSkillDto {
  profileId: string;
  name: string;
  category: string;
  language?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSkillDto {
  name?: string;
  category?: string;
  language?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  description?: string;
  metadata?: Record<string, any>;
}

// Skill Response DTOs
export interface SkillResponseDto {
  id: string;
  profileId: string;
  name: string;
  category: string;
  language?: string | undefined;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number | undefined;
  description?: string | undefined;
  metadata?: Record<string, any> | undefined;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  isBeginnerLevel?: boolean;
  isIntermediateLevel?: boolean;
  isAdvancedLevel?: boolean;
  isExpertLevel?: boolean;
  levelNumeric?: number;
  formattedExperience?: string;
  hasDescription?: boolean;
  hasMetadata?: boolean;
}

// Skill Filter and Query Types
export interface SkillFilters {
  profileId?: string;
  name?: string;
  category?: string;
  language?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  minYearsOfExperience?: number;
  maxYearsOfExperience?: number;
  hasDescription?: boolean;
  hasMetadata?: boolean;
  search?: string; // For searching across name, category, description
}

export interface SkillQueryParams extends SkillFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'category' | 'language' | 'level' | 'yearsOfExperience' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Skill Statistics
export interface SkillStatsDto {
  total: number;
  beginnerLevel: number;
  intermediateLevel: number;
  advancedLevel: number;
  expertLevel: number;
  categories: number;
  totalYearsOfExperience: number;
  averageYearsOfExperience: number;
  skillsWithDescription: number;
  skillsWithMetadata: number;
  mostExperiencedSkill?: SkillResponseDto;
  leastExperiencedSkill?: SkillResponseDto;
  expertSkills?: SkillResponseDto[];
  categoryCounts: Record<string, number>;
  levelCounts: Record<string, number>;
  experienceDistribution: {
    '0-1 years': number;
    '1-3 years': number;
    '3-5 years': number;
    '5-10 years': number;
    '10+ years': number;
  };
  topCategories: Array<{
    category: string;
    count: number;
    averageLevel: number;
    averageExperience: number;
  }>;
}

// Skill Lists
export interface SkillListResponseDto {
  skills: SkillResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: SkillFilters;
}

// Skill Validation Types
export interface SkillValidationDto {
  profileId: string;
  name: string;
  category: string;
  language?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  description?: string;
  metadata?: Record<string, any>;
}

// Skill Category Types
export interface SkillCategoryDto {
  category: string;
  count: number;
  skills: SkillResponseDto[];
  averageLevel: number;
  averageExperience: number;
  expertCount: number;
  advancedCount: number;
  intermediateCount: number;
  beginnerCount: number;
}

// Skill Level Types
export interface SkillLevelDto {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count: number;
  skills: SkillResponseDto[];
  averageExperience: number;
  categories: string[];
}

// Skill Comparison Types
export interface SkillComparisonDto {
  skill1: SkillResponseDto;
  skill2: SkillResponseDto;
  comparison: {
    levelDifference: number;
    experienceDifference: number;
    sameCategory: boolean;
    recommendations: string[];
  };
}

// Skill Recommendation Types
export interface SkillRecommendationDto {
  recommendedSkills: Array<{
    name: string;
    category: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    relatedSkills: string[];
  }>;
  skillGaps: Array<{
    category: string;
    missingLevel: 'intermediate' | 'advanced' | 'expert';
    suggestions: string[];
  }>;
  improvementAreas: Array<{
    skillId: string;
    currentLevel: string;
    suggestedLevel: string;
    actionItems: string[];
  }>;
} 
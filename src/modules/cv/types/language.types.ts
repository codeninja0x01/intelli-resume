// Language DTOs
export interface CreateLanguageDto {
  profileId: string;
  name: string;
  languageCode: string;
  proficiencyLevel: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative?: boolean;
  speakingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  writingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  readingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  listeningLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateLanguageDto {
  name?: string;
  languageCode?: string;
  proficiencyLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative?: boolean;
  speakingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  writingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  readingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  listeningLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  description?: string;
  metadata?: Record<string, any>;
}

// Language Response DTOs
export interface LanguageResponseDto {
  id: string;
  profileId: string;
  name: string;
  languageCode: string;
  proficiencyLevel: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative: boolean;
  speakingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native' | undefined;
  writingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native' | undefined;
  readingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native' | undefined;
  listeningLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native' | undefined;
  description?: string | undefined;
  metadata?: Record<string, any> | undefined;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  isBasicLevel?: boolean;
  isConversationalLevel?: boolean;
  isIntermediateLevel?: boolean;
  isAdvancedLevel?: boolean;
  isFluentLevel?: boolean;
  isNativeLevel?: boolean;
  proficiencyNumeric?: number;
  formattedProficiency?: string;
  hasDetailedProficiency?: boolean;
  detailedProficiency?: Record<string, string> | null;
}

// Language Filter and Query Types
export interface LanguageFilters {
  profileId?: string;
  name?: string;
  languageCode?: string;
  proficiencyLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative?: boolean;
  hasDetailedProficiency?: boolean;
  search?: string; // For searching across name, description
}

export interface LanguageQueryParams extends LanguageFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'languageCode' | 'proficiencyLevel' | 'isNative' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Language Statistics
export interface LanguageStatsDto {
  total: number;
  nativeLanguages: number;
  basicLevel: number;
  conversationalLevel: number;
  intermediateLevel: number;
  advancedLevel: number;
  fluentLevel: number;
  nativeLevel: number;
  languagesWithDetailedProficiency: number;
  languagesWithDescription: number;
  languagesWithMetadata: number;
  mostProficientLanguage?: LanguageResponseDto;
  nativeLanguagesList?: LanguageResponseDto[];
  fluentLanguagesList?: LanguageResponseDto[];
  proficiencyDistribution: Record<string, number>;
  languageCodeCounts: Record<string, number>;
  topLanguages: Array<{
    languageCode: string;
    name: string;
    count: number;
    averageProficiency: number;
  }>;
}

// Language Lists
export interface LanguageListResponseDto {
  languages: LanguageResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: LanguageFilters;
}

// Language Validation Types
export interface LanguageValidationDto {
  profileId: string;
  name: string;
  languageCode: string;
  proficiencyLevel: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative?: boolean;
  speakingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  writingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  readingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  listeningLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  description?: string;
  metadata?: Record<string, any>;
}

// Language Proficiency Types
export interface LanguageProficiencyDto {
  level: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  count: number;
  languages: LanguageResponseDto[];
  description: string;
}

// Language Code Types
export interface LanguageCodeDto {
  code: string;
  name: string;
  count: number;
  languages: LanguageResponseDto[];
  averageProficiency: number;
}

// Language Certification Types
export interface LanguageCertificationDto {
  language: LanguageResponseDto;
  certifications: Array<{
    name: string;
    score?: string;
    level?: string;
    date?: string;
    authority?: string;
  }>;
  recommendations: Array<{
    certification: string;
    reason: string;
    targetLevel: string;
  }>;
}

// Common Language Codes (ISO 639-1)
export const COMMON_LANGUAGE_CODES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish',
  'he': 'Hebrew'
} as const;

export type LanguageCode = keyof typeof COMMON_LANGUAGE_CODES;

// Proficiency Level Descriptions
export const PROFICIENCY_DESCRIPTIONS = {
  basic: 'Basic understanding, limited vocabulary',
  conversational: 'Can have simple conversations',
  intermediate: 'Can communicate effectively in most situations',
  advanced: 'Can express complex ideas fluently',
  fluent: 'Near-native proficiency in all areas',
  native: 'Native speaker or equivalent proficiency'
} as const; 
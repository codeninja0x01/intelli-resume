import { Op, WhereOptions } from 'sequelize';
import createError from 'http-errors';
import { Language } from '../models/Language.model';
import { Profile } from '../models/Profile.model';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
  LanguageResponseDto,
  LanguageFilters,
  LanguageQueryParams,
  LanguageStatsDto,
  LanguageListResponseDto,
  LanguageProficiencyDto,
} from '../types/language.types';

export class LanguageService {
  // Create language
  async createLanguage(languageData: CreateLanguageDto): Promise<LanguageResponseDto> {
    try {
      // Check if profile exists
      const profile = await Profile.findByPk(languageData.profileId);
      if (!profile) {
        throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      // Check for duplicate language code within the same profile
      const existingLanguage = await Language.findOne({
        where: {
          profileId: languageData.profileId,
          languageCode: languageData.languageCode,
        },
      });

      if (existingLanguage) {
        throw createError(409, 'Language already exists for this profile', { 
          code: 'LANGUAGE_ALREADY_EXISTS' 
        });
      }

      const language = await Language.create(languageData as any);
      return this.transformToResponseDto(language);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to create language', { code: 'LANGUAGE_CREATE_ERROR' });
    }
  }

  // Get language by ID
  async getLanguageById(languageId: string, profileId?: string): Promise<LanguageResponseDto> {
    try {
      const whereClause: WhereOptions = { id: languageId };
      if (profileId) whereClause.profileId = profileId;

      const language = await Language.findOne({
        where: whereClause,
        include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
      });

      if (!language) {
        throw createError(404, 'Language not found', { code: 'LANGUAGE_NOT_FOUND' });
      }

      return this.transformToResponseDto(language);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to retrieve language', { code: 'LANGUAGE_RETRIEVE_ERROR' });
    }
  }

  // Update language
  async updateLanguage(languageId: string, updateData: UpdateLanguageDto, profileId?: string): Promise<LanguageResponseDto> {
    try {
      const whereClause: WhereOptions = { id: languageId };
      if (profileId) whereClause.profileId = profileId;

      const language = await Language.findOne({ where: whereClause });
      if (!language) {
        throw createError(404, 'Language not found', { code: 'LANGUAGE_NOT_FOUND' });
      }

      // Check for duplicate language code if being updated
      if (updateData.languageCode) {
        const existingLanguage = await Language.findOne({
          where: {
            profileId: language.profileId,
            languageCode: updateData.languageCode,
            id: { [Op.ne]: languageId },
          },
        });

        if (existingLanguage) {
          throw createError(409, 'Language code already exists for this profile', { 
            code: 'LANGUAGE_ALREADY_EXISTS' 
          });
        }
      }

      await language.update(updateData);
      return this.transformToResponseDto(language);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to update language', { code: 'LANGUAGE_UPDATE_ERROR' });
    }
  }

  // Delete language
  async deleteLanguage(languageId: string, profileId?: string): Promise<void> {
    try {
      const whereClause: WhereOptions = { id: languageId };
      if (profileId) whereClause.profileId = profileId;

      const language = await Language.findOne({ where: whereClause });
      if (!language) {
        throw createError(404, 'Language not found', { code: 'LANGUAGE_NOT_FOUND' });
      }

      await language.destroy();
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to delete language', { code: 'LANGUAGE_DELETE_ERROR' });
    }
  }

  // List languages with filters and pagination
  async listLanguages(queryParams: LanguageQueryParams): Promise<LanguageListResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        ...filters
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereClause = this.buildWhereClause(filters);
      const order = this.buildOrderClause(sortBy, sortOrder);

      const { rows: languages, count: total } = await Language.findAndCountAll({
        where: whereClause,
        order,
        limit,
        offset,
        include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
      });

      const transformedLanguages = languages.map(language => this.transformToResponseDto(language));

      return {
        languages: transformedLanguages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        filters,
      };
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve languages', { code: 'LANGUAGES_RETRIEVE_ERROR' });
    }
  }

  // Get languages by profile ID
  async getLanguagesByProfile(profileId: string): Promise<LanguageResponseDto[]> {
    try {
      const languages = await Language.findByProfileId(profileId);
      return languages.map(language => this.transformToResponseDto(language));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve languages by profile', { code: 'LANGUAGES_PROFILE_RETRIEVE_ERROR' });
    }
  }

  // Get languages by proficiency level
  async getLanguagesByProficiency(
    level: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native', 
    profileId?: string
  ): Promise<LanguageResponseDto[]> {
    try {
      const languages = await Language.findByProficiencyLevel(level, profileId);
      return languages.map(language => this.transformToResponseDto(language));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve languages by proficiency', { code: 'LANGUAGES_PROFICIENCY_RETRIEVE_ERROR' });
    }
  }

  // Get native languages
  async getNativeLanguages(profileId?: string): Promise<LanguageResponseDto[]> {
    try {
      const languages = await Language.findNativeLanguages(profileId);
      return languages.map(language => this.transformToResponseDto(language));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve native languages', { code: 'NATIVE_LANGUAGES_RETRIEVE_ERROR' });
    }
  }

  // Get fluent languages (fluent + native)
  async getFluentLanguages(profileId?: string): Promise<LanguageResponseDto[]> {
    try {
      const whereClause: WhereOptions = {
        [Op.or]: [
          { proficiencyLevel: 'fluent' },
          { proficiencyLevel: 'native' },
          { isNative: true }
        ]
      };
      if (profileId) {
        (whereClause as any).profileId = profileId;
      }

      const languages = await Language.findAll({
        where: whereClause,
        order: [['isNative', 'DESC'], ['proficiencyLevel', 'DESC'], ['name', 'ASC']],
      });

      return languages.map(language => this.transformToResponseDto(language));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve fluent languages', { code: 'FLUENT_LANGUAGES_RETRIEVE_ERROR' });
    }
  }

  // Get languages by language code
  async getLanguagesByCode(languageCode: string, profileId?: string): Promise<LanguageResponseDto[]> {
    try {
      const languages = await Language.findByLanguageCode(languageCode, profileId);
      return languages.map(language => this.transformToResponseDto(language));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve languages by code', { code: 'LANGUAGES_CODE_RETRIEVE_ERROR' });
    }
  }

  // Get unique language codes
  async getUniqueLanguageCodes(profileId?: string): Promise<string[]> {
    try {
      return await Language.getUniqueLanguageCodes(profileId);
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve language codes', { code: 'LANGUAGE_CODES_RETRIEVE_ERROR' });
    }
  }

  // Get unique language names
  async getUniqueLanguageNames(profileId?: string): Promise<string[]> {
    try {
      return await Language.getUniqueLanguageNames(profileId);
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve language names', { code: 'LANGUAGE_NAMES_RETRIEVE_ERROR' });
    }
  }

  // Get language statistics
  async getLanguageStats(profileId?: string): Promise<LanguageStatsDto> {
    try {
      const whereClause: WhereOptions = {};
      if (profileId) whereClause.profileId = profileId;

      const languages = await Language.findAll({ where: whereClause });

      const stats: LanguageStatsDto = {
        total: languages.length,
        nativeLanguages: languages.filter(l => l.isNative).length,
        basicLevel: languages.filter(l => l.proficiencyLevel === 'basic').length,
        conversationalLevel: languages.filter(l => l.proficiencyLevel === 'conversational').length,
        intermediateLevel: languages.filter(l => l.proficiencyLevel === 'intermediate').length,
        advancedLevel: languages.filter(l => l.proficiencyLevel === 'advanced').length,
        fluentLevel: languages.filter(l => l.proficiencyLevel === 'fluent').length,
        nativeLevel: languages.filter(l => l.proficiencyLevel === 'native').length,
        languagesWithDetailedProficiency: languages.filter(l => l.hasDetailedProficiency()).length,
        languagesWithDescription: languages.filter(l => l.description && l.description.trim().length > 0).length,
        languagesWithMetadata: languages.filter(l => l.metadata && Object.keys(l.metadata).length > 0).length,
        proficiencyDistribution: {},
        languageCodeCounts: {},
        topLanguages: [],
      };

      // Find most proficient language
      if (languages.length > 0) {
        const mostProficient = languages.reduce((max, l) => 
          l.getProficiencyNumeric() > max.getProficiencyNumeric() ? l : max);
        stats.mostProficientLanguage = this.transformToResponseDto(mostProficient);
      }

      // Get native and fluent languages lists
      const nativeLanguages = languages.filter(l => l.isNative || l.proficiencyLevel === 'native');
      const fluentLanguages = languages.filter(l => l.proficiencyLevel === 'fluent' || l.proficiencyLevel === 'native' || l.isNative);
      
      stats.nativeLanguagesList = nativeLanguages.map(l => this.transformToResponseDto(l));
      stats.fluentLanguagesList = fluentLanguages.map(l => this.transformToResponseDto(l));

      // Proficiency distribution
      languages.forEach(language => {
        const level = language.proficiencyLevel;
        stats.proficiencyDistribution[level] = (stats.proficiencyDistribution[level] || 0) + 1;
      });

      // Language code counts
      languages.forEach(language => {
        const code = language.languageCode;
        stats.languageCodeCounts[code] = (stats.languageCodeCounts[code] || 0) + 1;
      });

      // Top languages by usage
      stats.topLanguages = Object.entries(stats.languageCodeCounts)
        .map(([code, count]) => {
          const codeLanguages = languages.filter(l => l.languageCode === code);
          const avgProficiency = codeLanguages.reduce((sum, l) => sum + l.getProficiencyNumeric(), 0) / codeLanguages.length;
          const name = codeLanguages[0]?.name || code;
          
          return { languageCode: code, name, count, averageProficiency: avgProficiency };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return stats;
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve language statistics', { code: 'LANGUAGE_STATS_ERROR' });
    }
  }

  // Get languages grouped by proficiency level
  async getLanguagesByProficiencyLevels(profileId?: string): Promise<LanguageProficiencyDto[]> {
    try {
      const levels: Array<'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native'> = 
        ['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'];
      
      const proficiencyDtos: LanguageProficiencyDto[] = [];

      for (const level of levels) {
        const languages = await this.getLanguagesByProficiency(level, profileId);
        
        const descriptions = {
          basic: 'Basic understanding, limited vocabulary',
          conversational: 'Can have simple conversations',
          intermediate: 'Can communicate effectively in most situations',
          advanced: 'Can express complex ideas fluently',
          fluent: 'Near-native proficiency in all areas',
          native: 'Native speaker or equivalent proficiency'
        };

        proficiencyDtos.push({
          level,
          count: languages.length,
          languages,
          description: descriptions[level],
        });
      }

      return proficiencyDtos.sort((a, b) => b.count - a.count);
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve languages by proficiency levels', { code: 'LANGUAGES_PROFICIENCY_LEVELS_ERROR' });
    }
  }

  // Private helper methods
  private buildWhereClause(filters: LanguageFilters): WhereOptions {
    const whereClause: WhereOptions = {};

    if (filters.profileId) whereClause.profileId = filters.profileId;
    if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    if (filters.languageCode) whereClause.languageCode = { [Op.iLike]: `%${filters.languageCode}%` };
    if (filters.proficiencyLevel) whereClause.proficiencyLevel = filters.proficiencyLevel;
    if (filters.isNative !== undefined) whereClause.isNative = filters.isNative;

    if (filters.hasDetailedProficiency !== undefined) {
      if (filters.hasDetailedProficiency) {
        whereClause[Op.or as any] = [
          { speakingLevel: { [Op.ne]: null } },
          { writingLevel: { [Op.ne]: null } },
          { readingLevel: { [Op.ne]: null } },
          { listeningLevel: { [Op.ne]: null } },
        ];
      } else {
        whereClause.speakingLevel = { [Op.is]: null };
        whereClause.writingLevel = { [Op.is]: null };
        whereClause.readingLevel = { [Op.is]: null };
        whereClause.listeningLevel = { [Op.is]: null };
      }
    }

    if (filters.search) {
      const searchConditions = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { languageCode: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
      whereClause[Op.or as any] = searchConditions;
    }

    return whereClause;
  }

  private buildOrderClause(sortBy: string, sortOrder: string): any[] {
    const validSortFields = ['name', 'languageCode', 'proficiencyLevel', 'isNative', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    if (field === 'proficiencyLevel') {
      // Custom ordering for proficiency level enum
      return [[`CASE 
        WHEN proficiency_level = 'native' THEN 6 
        WHEN proficiency_level = 'fluent' THEN 5 
        WHEN proficiency_level = 'advanced' THEN 4 
        WHEN proficiency_level = 'intermediate' THEN 3 
        WHEN proficiency_level = 'conversational' THEN 2 
        WHEN proficiency_level = 'basic' THEN 1 
        END`, order]];
    }

    return [[field, order]];
  }

  private transformToResponseDto(language: Language): LanguageResponseDto {
    return {
      id: language.id,
      profileId: language.profileId,
      name: language.name,
      languageCode: language.languageCode,
      proficiencyLevel: language.proficiencyLevel,
      isNative: language.isNative,
      speakingLevel: language.speakingLevel ?? undefined,
      writingLevel: language.writingLevel ?? undefined,
      readingLevel: language.readingLevel ?? undefined,
      listeningLevel: language.listeningLevel ?? undefined,
      description: language.description ?? undefined,
      metadata: language.metadata ?? undefined,
      createdAt: language.createdAt.toISOString(),
      updatedAt: language.updatedAt.toISOString(),
      
      // Computed fields
      isBasicLevel: language.isBasicLevel(),
      isConversationalLevel: language.isConversationalLevel(),
      isIntermediateLevel: language.isIntermediateLevel(),
      isAdvancedLevel: language.isAdvancedLevel(),
      isFluentLevel: language.isFluentLevel(),
      isNativeLevel: language.isNativeLevel(),
      proficiencyNumeric: language.getProficiencyNumeric(),
      formattedProficiency: language.getFormattedProficiency(),
      hasDetailedProficiency: language.hasDetailedProficiency(),
      detailedProficiency: language.getDetailedProficiency(),
    };
  }
}

export const languageService = new LanguageService(); 
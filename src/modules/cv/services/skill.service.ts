import { Op, WhereOptions } from 'sequelize';
import createError from 'http-errors';
import { Skill } from '../models/Skill.model';
import { Profile } from '../models/Profile.model';
import {
  CreateSkillDto,
  UpdateSkillDto,
  SkillResponseDto,
  SkillFilters,
  SkillQueryParams,
  SkillStatsDto,
  SkillListResponseDto,
  SkillCategoryDto,
} from '../types/skill.types';

export class SkillService {
  // Create skill
  async createSkill(skillData: CreateSkillDto): Promise<SkillResponseDto> {
    try {
      // Check if profile exists
      const profile = await Profile.findByPk(skillData.profileId);
      if (!profile) {
        throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      // Check for duplicate skill name within the same profile and category
      const existingSkill = await Skill.findOne({
        where: {
          profileId: skillData.profileId,
          name: skillData.name,
          category: skillData.category,
        },
      });

      if (existingSkill) {
        throw createError(409, 'Skill with this name already exists in this category', { 
          code: 'SKILL_ALREADY_EXISTS' 
        });
      }

      const skill = await Skill.create(skillData as any);
      return this.transformToResponseDto(skill);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to create skill', { code: 'SKILL_CREATE_ERROR' });
    }
  }

  // Get skill by ID
  async getSkillById(skillId: string, profileId?: string): Promise<SkillResponseDto> {
    try {
      const whereClause: WhereOptions = { id: skillId };
      if (profileId) whereClause.profileId = profileId;

      const skill = await Skill.findOne({
        where: whereClause,
        include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
      });

      if (!skill) {
        throw createError(404, 'Skill not found', { code: 'SKILL_NOT_FOUND' });
      }

      return this.transformToResponseDto(skill);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to retrieve skill', { code: 'SKILL_RETRIEVE_ERROR' });
    }
  }

  // Update skill
  async updateSkill(skillId: string, updateData: UpdateSkillDto, profileId?: string): Promise<SkillResponseDto> {
    try {
      const whereClause: WhereOptions = { id: skillId };
      if (profileId) whereClause.profileId = profileId;

      const skill = await Skill.findOne({ where: whereClause });
      if (!skill) {
        throw createError(404, 'Skill not found', { code: 'SKILL_NOT_FOUND' });
      }

      // Check for duplicate skill name if name or category is being updated
      if (updateData.name || updateData.category) {
        const existingSkill = await Skill.findOne({
          where: {
            profileId: skill.profileId,
            name: updateData.name || skill.name,
            category: updateData.category || skill.category,
            id: { [Op.ne]: skillId },
          },
        });

        if (existingSkill) {
          throw createError(409, 'Skill with this name already exists in this category', { 
            code: 'SKILL_ALREADY_EXISTS' 
          });
        }
      }

      await skill.update(updateData);
      return this.transformToResponseDto(skill);
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to update skill', { code: 'SKILL_UPDATE_ERROR' });
    }
  }

  // Delete skill
  async deleteSkill(skillId: string, profileId?: string): Promise<void> {
    try {
      const whereClause: WhereOptions = { id: skillId };
      if (profileId) whereClause.profileId = profileId;

      const skill = await Skill.findOne({ where: whereClause });
      if (!skill) {
        throw createError(404, 'Skill not found', { code: 'SKILL_NOT_FOUND' });
      }

      await skill.destroy();
    } catch (error: any) {
      if (error.status) throw error;
      throw createError(500, 'Failed to delete skill', { code: 'SKILL_DELETE_ERROR' });
    }
  }

  // List skills with filters and pagination
  async listSkills(queryParams: SkillQueryParams): Promise<SkillListResponseDto> {
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

      const { rows: skills, count: total } = await Skill.findAndCountAll({
        where: whereClause,
        order,
        limit,
        offset,
        include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
      });

      const transformedSkills = skills.map(skill => this.transformToResponseDto(skill));

      return {
        skills: transformedSkills,
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
      throw createError(500, 'Failed to retrieve skills', { code: 'SKILLS_RETRIEVE_ERROR' });
    }
  }

  // Get skills by profile ID
  async getSkillsByProfile(profileId: string): Promise<SkillResponseDto[]> {
    try {
      const skills = await Skill.findByProfileId(profileId);
      return skills.map(skill => this.transformToResponseDto(skill));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve skills by profile', { code: 'SKILLS_PROFILE_RETRIEVE_ERROR' });
    }
  }

  // Get skills by category
  async getSkillsByCategory(category: string, profileId?: string): Promise<SkillResponseDto[]> {
    try {
      const skills = await Skill.findByCategory(category, profileId);
      return skills.map(skill => this.transformToResponseDto(skill));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve skills by category', { code: 'SKILLS_CATEGORY_RETRIEVE_ERROR' });
    }
  }

  // Get skills by level
  async getSkillsByLevel(level: 'beginner' | 'intermediate' | 'advanced' | 'expert', profileId?: string): Promise<SkillResponseDto[]> {
    try {
      const skills = await Skill.findByLevel(level, profileId);
      return skills.map(skill => this.transformToResponseDto(skill));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve skills by level', { code: 'SKILLS_LEVEL_RETRIEVE_ERROR' });
    }
  }

  // Get expert skills
  async getExpertSkills(profileId?: string): Promise<SkillResponseDto[]> {
    try {
      const skills = await Skill.findExpertSkills(profileId);
      return skills.map(skill => this.transformToResponseDto(skill));
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve expert skills', { code: 'EXPERT_SKILLS_RETRIEVE_ERROR' });
    }
  }

  // Get unique categories
  async getUniqueCategories(profileId?: string): Promise<string[]> {
    try {
      return await Skill.getUniqueCategories(profileId);
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve categories', { code: 'CATEGORIES_RETRIEVE_ERROR' });
    }
  }

  // Get skill statistics
  async getSkillStats(profileId?: string): Promise<SkillStatsDto> {
    try {
      const whereClause: WhereOptions = {};
      if (profileId) whereClause.profileId = profileId;

      const skills = await Skill.findAll({ where: whereClause });

      const stats: SkillStatsDto = {
        total: skills.length,
        beginnerLevel: skills.filter(s => s.level === 'beginner').length,
        intermediateLevel: skills.filter(s => s.level === 'intermediate').length,
        advancedLevel: skills.filter(s => s.level === 'advanced').length,
        expertLevel: skills.filter(s => s.level === 'expert').length,
        categories: new Set(skills.map(s => s.category)).size,
        totalYearsOfExperience: skills.reduce((sum, s) => sum + (s.yearsOfExperience || 0), 0),
        averageYearsOfExperience: 0,
        skillsWithDescription: skills.filter(s => s.hasDescription()).length,
        skillsWithMetadata: skills.filter(s => s.hasMetadata()).length,
        categoryCounts: {},
        levelCounts: {},
        experienceDistribution: {
          '0-1 years': 0,
          '1-3 years': 0,
          '3-5 years': 0,
          '5-10 years': 0,
          '10+ years': 0,
        },
        topCategories: [],
      };

      // Calculate average years of experience
      const skillsWithExperience = skills.filter(s => s.yearsOfExperience);
      stats.averageYearsOfExperience = skillsWithExperience.length > 0 
        ? stats.totalYearsOfExperience / skillsWithExperience.length 
        : 0;

      // Find most and least experienced skills
      const skillsWithExp = skills.filter(s => s.yearsOfExperience);
      if (skillsWithExp.length > 0) {
        const mostExp = skillsWithExp.reduce((max, s) => 
          (s.yearsOfExperience || 0) > (max.yearsOfExperience || 0) ? s : max);
        const leastExp = skillsWithExp.reduce((min, s) => 
          (s.yearsOfExperience || 0) < (min.yearsOfExperience || 0) ? s : min);
        
        stats.mostExperiencedSkill = this.transformToResponseDto(mostExp);
        stats.leastExperiencedSkill = this.transformToResponseDto(leastExp);
      }

      // Get expert skills
      const expertSkills = skills.filter(s => s.level === 'expert');
      stats.expertSkills = expertSkills.map(s => this.transformToResponseDto(s));

      // Category counts
      skills.forEach(skill => {
        stats.categoryCounts[skill.category] = (stats.categoryCounts[skill.category] || 0) + 1;
      });

      // Level counts
      skills.forEach(skill => {
        stats.levelCounts[skill.level] = (stats.levelCounts[skill.level] || 0) + 1;
      });

      // Experience distribution
      skills.forEach(skill => {
        const years = skill.yearsOfExperience || 0;
        if (years <= 1) stats.experienceDistribution['0-1 years']++;
        else if (years <= 3) stats.experienceDistribution['1-3 years']++;
        else if (years <= 5) stats.experienceDistribution['3-5 years']++;
        else if (years <= 10) stats.experienceDistribution['5-10 years']++;
        else stats.experienceDistribution['10+ years']++;
      });

      // Top categories
      stats.topCategories = Object.entries(stats.categoryCounts)
        .map(([category, count]) => {
          const categorySkills = skills.filter(s => s.category === category);
          const avgLevel = categorySkills.reduce((sum, s) => sum + s.getLevelNumeric(), 0) / categorySkills.length;
          const avgExp = categorySkills.reduce((sum, s) => sum + (s.yearsOfExperience || 0), 0) / categorySkills.length;
          
          return { category, count, averageLevel: avgLevel, averageExperience: avgExp };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return stats;
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve skill statistics', { code: 'SKILL_STATS_ERROR' });
    }
  }

  // Get skills grouped by category
  async getSkillsByCategories(profileId?: string): Promise<SkillCategoryDto[]> {
    try {
      const categories = await this.getUniqueCategories(profileId);
      const categoryDtos: SkillCategoryDto[] = [];

      for (const category of categories) {
        const skills = await this.getSkillsByCategory(category, profileId);
        
        const categoryDto: SkillCategoryDto = {
          category,
          count: skills.length,
          skills,
          averageLevel: skills.reduce((sum, s) => sum + (s.levelNumeric || 0), 0) / skills.length,
          averageExperience: skills.reduce((sum, s) => sum + (s.yearsOfExperience || 0), 0) / skills.length,
          expertCount: skills.filter(s => s.level === 'expert').length,
          advancedCount: skills.filter(s => s.level === 'advanced').length,
          intermediateCount: skills.filter(s => s.level === 'intermediate').length,
          beginnerCount: skills.filter(s => s.level === 'beginner').length,
        };

        categoryDtos.push(categoryDto);
      }

      return categoryDtos.sort((a, b) => b.count - a.count);
    } catch (error: any) {
      throw createError(500, 'Failed to retrieve skills by categories', { code: 'SKILLS_CATEGORIES_ERROR' });
    }
  }

  // Private helper methods
  private buildWhereClause(filters: SkillFilters): WhereOptions {
    const whereClause: WhereOptions = {};

    if (filters.profileId) whereClause.profileId = filters.profileId;
    if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    if (filters.category) whereClause.category = { [Op.iLike]: `%${filters.category}%` };
    if (filters.language) whereClause.language = { [Op.iLike]: `%${filters.language}%` };
    if (filters.level) whereClause.level = filters.level;

    if (filters.minYearsOfExperience !== undefined || filters.maxYearsOfExperience !== undefined) {
      const experienceClause: any = {};
      if (filters.minYearsOfExperience !== undefined) experienceClause[Op.gte] = filters.minYearsOfExperience;
      if (filters.maxYearsOfExperience !== undefined) experienceClause[Op.lte] = filters.maxYearsOfExperience;
      whereClause.yearsOfExperience = experienceClause;
    }

    if (filters.hasDescription !== undefined) {
      if (filters.hasDescription) {
        whereClause.description = { [Op.ne]: null };
      } else {
        whereClause.description = { [Op.is]: null };
      }
    }

    if (filters.hasMetadata !== undefined) {
      if (filters.hasMetadata) {
        whereClause.metadata = { [Op.ne]: null };
      } else {
        whereClause.metadata = { [Op.is]: null };
      }
    }

    if (filters.search) {
      const searchConditions = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { category: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
      whereClause[Op.or as any] = searchConditions;
    }

    return whereClause;
  }

  private buildOrderClause(sortBy: string, sortOrder: string): any[] {
    const validSortFields = ['name', 'category', 'language', 'level', 'yearsOfExperience', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    if (field === 'level') {
      // Custom ordering for level enum
      return [[`CASE 
        WHEN level = 'expert' THEN 4 
        WHEN level = 'advanced' THEN 3 
        WHEN level = 'intermediate' THEN 2 
        WHEN level = 'beginner' THEN 1 
        END`, order]];
    }

    return [[field, order]];
  }

  private transformToResponseDto(skill: Skill): SkillResponseDto {
    return {
      id: skill.id,
      profileId: skill.profileId,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      yearsOfExperience: skill.yearsOfExperience ?? undefined,
      description: skill.description ?? undefined,
      metadata: skill.metadata ?? undefined,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString(),
      
      // Computed fields
      isBeginnerLevel: skill.isBeginnerLevel(),
      isIntermediateLevel: skill.isIntermediateLevel(),
      isAdvancedLevel: skill.isAdvancedLevel(),
      isExpertLevel: skill.isExpertLevel(),
      levelNumeric: skill.getLevelNumeric(),
      formattedExperience: skill.getFormattedExperience(),
      hasDescription: skill.hasDescription(),
      hasMetadata: skill.hasMetadata(),
    };
  }
}

export const skillService = new SkillService(); 
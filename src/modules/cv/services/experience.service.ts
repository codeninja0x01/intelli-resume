import { Op, WhereOptions } from 'sequelize';
import createError from 'http-errors';
import { Experience } from '../models/Experience.model';
import { Profile } from '../models/Profile.model';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
  ExperienceResponseDto,
  ExperienceFilters,
  ExperienceStatsDto,
  ExperienceListResponseDto,
  ExperienceQueryParams,
} from '../types/experience.types';

export class ExperienceService {
  // Create a new experience record
  async createExperience(data: CreateExperienceDto): Promise<ExperienceResponseDto> {
    try {
      // Verify profile exists
      const profile = await Profile.findByPk(data.profileId);
      if (!profile) {
        throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      // Create experience record
      const experience = await Experience.create({
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });

      return this.formatExperienceResponse(experience);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
        throw createError(400, 'Invalid experience data', { 
          code: 'VALIDATION_ERROR',
          details: error.message,
        });
      }
      throw error;
    }
  }

  // Get experience by ID
  async getExperienceById(id: string, profileId?: string): Promise<ExperienceResponseDto> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const experience = await Experience.findOne({ where: whereClause });
    
    if (!experience) {
      throw createError(404, 'Experience record not found', { code: 'EXPERIENCE_NOT_FOUND' });
    }

    return this.formatExperienceResponse(experience);
  }

  // Update experience
  async updateExperience(id: string, data: UpdateExperienceDto, profileId?: string): Promise<ExperienceResponseDto> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const experience = await Experience.findOne({ where: whereClause });
    
    if (!experience) {
      throw createError(404, 'Experience record not found', { code: 'EXPERIENCE_NOT_FOUND' });
    }

    try {
      // Prepare update data
      const updateData: any = { ...data };
      if (data.startDate) updateData.startDate = new Date(data.startDate);
      if (data.endDate) updateData.endDate = new Date(data.endDate);

      // Validate date logic if both dates are being updated
      if (updateData.startDate && updateData.endDate) {
        if (updateData.endDate <= updateData.startDate) {
          throw createError(400, 'End date must be after start date', { code: 'INVALID_DATE_RANGE' });
        }
      }

      // Handle isCurrent logic
      if (data.isCurrent !== undefined) {
        if (data.isCurrent && data.endDate) {
          throw createError(400, 'Cannot set end date for current position', { code: 'INVALID_CURRENT_STATUS' });
        }
        if (!data.isCurrent && !data.endDate && !experience.endDate) {
          throw createError(400, 'End date required for past position', { code: 'END_DATE_REQUIRED' });
        }
      }

      await experience.update(updateData);
      return this.formatExperienceResponse(experience);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
        throw createError(400, 'Invalid experience data', { 
          code: 'VALIDATION_ERROR',
          details: error.message,
        });
      }
      throw error;
    }
  }

  // Delete experience (soft delete)
  async deleteExperience(id: string, profileId?: string): Promise<void> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const experience = await Experience.findOne({ where: whereClause });
    
    if (!experience) {
      throw createError(404, 'Experience record not found', { code: 'EXPERIENCE_NOT_FOUND' });
    }

    await experience.destroy(); // Soft delete
  }

  // List experience with filtering and pagination
  async listExperience(queryParams: ExperienceQueryParams): Promise<ExperienceListResponseDto> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'DESC',
      ...filters
    } = queryParams;

    const offset = (page - 1) * limit;
    const whereClause = this.buildWhereClause(filters);

    const { count, rows } = await Experience.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      experiences: rows.map(experience => this.formatExperienceResponse(experience)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters,
    };
  }

  // Get experience by profile ID
  async getExperienceByProfile(profileId: string): Promise<ExperienceResponseDto[]> {
    // Verify profile exists
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
    }

    const experiences = await Experience.findByProfileId(profileId);
    return experiences.map(exp => this.formatExperienceResponse(exp));
  }

  // Get current experience for profile
  async getCurrentExperience(profileId?: string): Promise<ExperienceResponseDto[]> {
    const experiences = await Experience.findCurrentExperiences(profileId);
    return experiences.map(exp => this.formatExperienceResponse(exp));
  }

  // Get experience by company
  async getExperienceByCompany(company: string, profileId?: string): Promise<ExperienceResponseDto[]> {
    const experiences = await Experience.findByCompany(company, profileId);
    return experiences.map(exp => this.formatExperienceResponse(exp));
  }

  // Get experience by title
  async getExperienceByTitle(title: string, profileId?: string): Promise<ExperienceResponseDto[]> {
    const experiences = await Experience.findByTitle(title, profileId);
    return experiences.map(exp => this.formatExperienceResponse(exp));
  }

  // Get experience by location
  async getExperienceByLocation(location: string, profileId?: string): Promise<ExperienceResponseDto[]> {
    const experiences = await Experience.findByLocation(location, profileId);
    return experiences.map(exp => this.formatExperienceResponse(exp));
  }

  // Get experience statistics
  async getExperienceStats(profileId?: string): Promise<ExperienceStatsDto> {
    const whereClause: WhereOptions = {};
    if (profileId) whereClause.profileId = profileId;

    const experiences = await Experience.findAll({ 
      where: whereClause,
      order: [['startDate', 'DESC']],
    });

    if (experiences.length === 0) {
      return {
        total: 0,
        current: 0,
        past: 0,
        companies: 0,
        positions: 0,
        locations: 0,
        totalExperienceInYears: 0,
        averagePositionDurationInYears: 0,
        totalResponsibilities: 0,
        totalAchievements: 0,
        totalSkills: 0,
        uniqueSkills: 0,
        companyCounts: {},
        titleCounts: {},
        locationCounts: {},
        skillsFrequency: {},
        yearWiseExperience: {},
      };
    }

    const current = experiences.filter(exp => exp.isCurrentPosition()).length;
    const past = experiences.filter(exp => exp.isPastPosition()).length;
    const companies = new Set(experiences.map(exp => exp.company)).size;
    const positions = new Set(experiences.map(exp => exp.title)).size;
    const locations = new Set(experiences.map(exp => exp.location)).size;

    const totalExperienceInYears = experiences.reduce((sum, exp) => sum + exp.getDurationInYears(), 0);
    const averagePositionDurationInYears = experiences.length > 0 ? totalExperienceInYears / experiences.length : 0;

    // Calculate totals
    const totalResponsibilities = experiences.reduce((sum, exp) => sum + exp.getTotalResponsibilitiesCount(), 0);
    const totalAchievements = experiences.reduce((sum, exp) => sum + exp.getTotalAchievementsCount(), 0);
    const totalSkills = experiences.reduce((sum, exp) => sum + exp.getTotalSkillsCount(), 0);

    // Calculate unique skills
    const allSkills = new Set<string>();
    experiences.forEach(exp => {
      if (exp.skills) {
        exp.skills.forEach(skill => allSkills.add(skill));
      }
    });
    const uniqueSkills = allSkills.size;

    // Find most recent and longest experience
    const mostRecent = experiences[0]; // Already sorted by startDate DESC
    const longestExperience = experiences.reduce((longest, current) => 
      current.getDurationInMonths() > longest.getDurationInMonths() ? current : longest
    );

    // Get current experiences
    const currentExperiences = experiences.filter(exp => exp.isCurrentPosition());

    // Generate counts and distributions
    const companyCounts: Record<string, number> = {};
    const titleCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const skillsFrequency: Record<string, number> = {};
    const yearWiseExperience: Record<string, number> = {};

    experiences.forEach(exp => {
      // Company counts
      companyCounts[exp.company] = (companyCounts[exp.company] || 0) + 1;
      
      // Title counts
      titleCounts[exp.title] = (titleCounts[exp.title] || 0) + 1;
      
      // Location counts
      locationCounts[exp.location] = (locationCounts[exp.location] || 0) + 1;
      
      // Skills frequency
      if (exp.skills) {
        exp.skills.forEach(skill => {
          skillsFrequency[skill] = (skillsFrequency[skill] || 0) + 1;
        });
      }

      // Year-wise experience
      const startYear = new Date(exp.startDate).getFullYear();
      const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear();
      
      for (let year = startYear; year <= endYear; year++) {
        yearWiseExperience[year.toString()] = (yearWiseExperience[year.toString()] || 0) + 1;
      }
    });

    return {
      total: experiences.length,
      current,
      past,
      companies,
      positions,
      locations,
      totalExperienceInYears: Math.round(totalExperienceInYears * 10) / 10,
      averagePositionDurationInYears: Math.round(averagePositionDurationInYears * 10) / 10,
      totalResponsibilities,
      totalAchievements,
      totalSkills,
      uniqueSkills,
      mostRecentExperience: this.formatExperienceResponse(mostRecent),
      longestExperience: this.formatExperienceResponse(longestExperience),
      currentExperiences: currentExperiences.map(exp => this.formatExperienceResponse(exp)),
      companyCounts,
      titleCounts,
      locationCounts,
      skillsFrequency,
      yearWiseExperience,
    };
  }

  // Private helper methods
  private buildWhereClause(filters: ExperienceFilters): WhereOptions {
    const whereClause: WhereOptions = {};

    if (filters.profileId) {
      whereClause.profileId = filters.profileId;
    }

    if (filters.title) {
      whereClause.title = { [Op.iLike]: `%${filters.title}%` };
    }

    if (filters.company) {
      whereClause.company = { [Op.iLike]: `%${filters.company}%` };
    }

    if (filters.location) {
      whereClause.location = { [Op.iLike]: `%${filters.location}%` };
    }

    if (filters.isCurrent !== undefined) {
      whereClause.isCurrent = filters.isCurrent;
    }

    if (filters.isPast !== undefined) {
      if (filters.isPast) {
        whereClause.isCurrent = false;
        whereClause.endDate = { [Op.ne]: null };
      } else {
        whereClause.isCurrent = true;
      }
    }

    if (filters.startDateFrom || filters.startDateTo) {
      const dateFilter: any = {};
      if (filters.startDateFrom) dateFilter[Op.gte] = new Date(filters.startDateFrom);
      if (filters.startDateTo) dateFilter[Op.lte] = new Date(filters.startDateTo);
      whereClause.startDate = dateFilter;
    }

    if (filters.endDateFrom || filters.endDateTo) {
      const dateFilter: any = {};
      if (filters.endDateFrom) dateFilter[Op.gte] = new Date(filters.endDateFrom);
      if (filters.endDateTo) dateFilter[Op.lte] = new Date(filters.endDateTo);
      whereClause.endDate = dateFilter;
    }

    if (filters.minDurationMonths || filters.maxDurationMonths) {
      // This would require a computed field or raw SQL - simplified implementation
      // In production, you might want to add this as a database computed column
    }

    if (filters.hasDescription !== undefined) {
      whereClause.description = filters.hasDescription ? { [Op.ne]: null } : null;
    }

    if (filters.hasResponsibilities !== undefined) {
      if (filters.hasResponsibilities) {
        whereClause.responsibilities = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '[]' }] };
      } else {
        whereClause[Op.or as any] = [{ responsibilities: null }, { responsibilities: '[]' }];
      }
    }

    if (filters.hasAchievements !== undefined) {
      if (filters.hasAchievements) {
        whereClause.achievements = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '[]' }] };
      } else {
        whereClause[Op.or as any] = [{ achievements: null }, { achievements: '[]' }];
      }
    }

    if (filters.hasSkills !== undefined) {
      if (filters.hasSkills) {
        whereClause.skills = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '[]' }] };
      } else {
        whereClause[Op.or as any] = [{ skills: null }, { skills: '[]' }];
      }
    }

    if (filters.search) {
      whereClause[Op.or as any] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { company: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { location: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    return whereClause;
  }

  private formatExperienceResponse(experience: Experience): ExperienceResponseDto {
    const response: ExperienceResponseDto = {
      id: experience.id,
      profileId: experience.profileId,
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate.toISOString().split('T')[0],
      isCurrent: experience.isCurrent,
      description: experience.description,
      responsibilities: experience.responsibilities,
      achievements: experience.achievements,
      skills: experience.skills,
      createdAt: experience.createdAt.toISOString(),
      updatedAt: experience.updatedAt.toISOString(),
      
      // Computed fields
      durationInMonths: experience.getDurationInMonths(),
      durationInYears: experience.getDurationInYears(),
      formattedDuration: experience.getFormattedDuration(),
      isCurrentPosition: experience.isCurrentPosition(),
      isPastPosition: experience.isPastPosition(),
      totalResponsibilitiesCount: experience.getTotalResponsibilitiesCount(),
      totalAchievementsCount: experience.getTotalAchievementsCount(),
      totalSkillsCount: experience.getTotalSkillsCount(),
    };

    // Only include optional properties if they exist
    if (experience.endDate) {
      response.endDate = experience.endDate.toISOString().split('T')[0];
    }
    if (experience.metadata) {
      response.metadata = experience.metadata;
    }

    return response;
  }
}

export const experienceService = new ExperienceService(); 
import { Op, WhereOptions } from 'sequelize';
import createError from 'http-errors';
import { Education } from '../models/Education.model';
import { Profile } from '../models/Profile.model';
import {
  CreateEducationDto,
  UpdateEducationDto,
  EducationResponseDto,
  EducationFilters,
  EducationStatsDto,
  EducationListResponseDto,
  EducationQueryParams,
} from '../types/education.types';

export class EducationService {
  // Create a new education record
  async createEducation(data: CreateEducationDto): Promise<EducationResponseDto> {
    try {
      // Verify profile exists
      const profile = await Profile.findByPk(data.profileId);
      if (!profile) {
        throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
      }

      // Create education record
      const education = await Education.create({
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });

      return this.formatEducationResponse(education);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
        throw createError(400, 'Invalid education data', { 
          code: 'VALIDATION_ERROR',
          details: error.message,
        });
      }
      throw error;
    }
  }

  // Get education by ID
  async getEducationById(id: string, profileId?: string): Promise<EducationResponseDto> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const education = await Education.findOne({ where: whereClause });
    
    if (!education) {
      throw createError(404, 'Education record not found', { code: 'EDUCATION_NOT_FOUND' });
    }

    return this.formatEducationResponse(education);
  }

  // Update education
  async updateEducation(id: string, data: UpdateEducationDto, profileId?: string): Promise<EducationResponseDto> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const education = await Education.findOne({ where: whereClause });
    
    if (!education) {
      throw createError(404, 'Education record not found', { code: 'EDUCATION_NOT_FOUND' });
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
          throw createError(400, 'Cannot set end date for current education', { code: 'INVALID_CURRENT_STATUS' });
        }
        if (!data.isCurrent && !data.endDate && !education.endDate) {
          throw createError(400, 'End date required for completed education', { code: 'END_DATE_REQUIRED' });
        }
      }

      await education.update(updateData);
      return this.formatEducationResponse(education);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
        throw createError(400, 'Invalid education data', { 
          code: 'VALIDATION_ERROR',
          details: error.message,
        });
      }
      throw error;
    }
  }

  // Delete education (soft delete)
  async deleteEducation(id: string, profileId?: string): Promise<void> {
    const whereClause: WhereOptions = { id };
    if (profileId) whereClause.profileId = profileId;

    const education = await Education.findOne({ where: whereClause });
    
    if (!education) {
      throw createError(404, 'Education record not found', { code: 'EDUCATION_NOT_FOUND' });
    }

    await education.destroy(); // Soft delete
  }

  // List education with filtering and pagination
  async listEducation(queryParams: EducationQueryParams): Promise<EducationListResponseDto> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'DESC',
      ...filters
    } = queryParams;

    const offset = (page - 1) * limit;
    const whereClause = this.buildWhereClause(filters);

    const { count, rows } = await Education.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [{ model: Profile, attributes: ['id', 'firstName', 'lastName'] }],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      education: rows.map(education => this.formatEducationResponse(education)),
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

  // Get education by profile ID
  async getEducationByProfile(profileId: string): Promise<EducationResponseDto[]> {
    // Verify profile exists
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      throw createError(404, 'Profile not found', { code: 'PROFILE_NOT_FOUND' });
    }

    const education = await Education.findByProfileId(profileId);
    return education.map(edu => this.formatEducationResponse(edu));
  }

  // Get current education for profile
  async getCurrentEducation(profileId?: string): Promise<EducationResponseDto[]> {
    const education = await Education.findCurrentEducation(profileId);
    return education.map(edu => this.formatEducationResponse(edu));
  }

  // Get education by institution
  async getEducationByInstitution(institution: string, profileId?: string): Promise<EducationResponseDto[]> {
    const education = await Education.findByInstitution(institution, profileId);
    return education.map(edu => this.formatEducationResponse(edu));
  }

  // Get education by degree
  async getEducationByDegree(degree: string, profileId?: string): Promise<EducationResponseDto[]> {
    const education = await Education.findByDegree(degree, profileId);
    return education.map(edu => this.formatEducationResponse(edu));
  }

  // Get education statistics
  async getEducationStats(profileId?: string): Promise<EducationStatsDto> {
    const whereClause: WhereOptions = {};
    if (profileId) whereClause.profileId = profileId;

    const education = await Education.findAll({ 
      where: whereClause,
      order: [['startDate', 'DESC']],
    });

    if (education.length === 0) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        institutions: 0,
        degrees: 0,
        fieldsOfStudy: 0,
        totalDurationInYears: 0,
        averageDurationInYears: 0,
        institutionCounts: {},
        degreeCounts: {},
        fieldOfStudyCounts: {},
        gradeDistribution: {},
        skillsFrequency: {},
      };
    }

    const inProgress = education.filter(edu => edu.isInProgress()).length;
    const completed = education.filter(edu => edu.isCompleted()).length;
    const institutions = new Set(education.map(edu => edu.institution)).size;
    const degrees = new Set(education.map(edu => edu.degree)).size;
    const fieldsOfStudy = new Set(education.map(edu => edu.fieldOfStudy)).size;

    const totalDurationInYears = education.reduce((sum, edu) => sum + edu.getDurationInYears(), 0);
    const averageDurationInYears = education.length > 0 ? totalDurationInYears / education.length : 0;

    // Find most recent and longest education
    const mostRecent = education[0]; // Already sorted by startDate DESC
    const longestEducation = education.reduce((longest, current) => 
      current.getDurationInMonths() > longest.getDurationInMonths() ? current : longest
    );

    // Generate counts and distributions
    const institutionCounts: Record<string, number> = {};
    const degreeCounts: Record<string, number> = {};
    const fieldOfStudyCounts: Record<string, number> = {};
    const gradeDistribution: Record<string, number> = {};
    const skillsFrequency: Record<string, number> = {};

    education.forEach(edu => {
      // Institution counts
      institutionCounts[edu.institution] = (institutionCounts[edu.institution] || 0) + 1;
      
      // Degree counts
      degreeCounts[edu.degree] = (degreeCounts[edu.degree] || 0) + 1;
      
      // Field of study counts
      fieldOfStudyCounts[edu.fieldOfStudy] = (fieldOfStudyCounts[edu.fieldOfStudy] || 0) + 1;
      
      // Grade distribution
      if (edu.grade) {
        gradeDistribution[edu.grade] = (gradeDistribution[edu.grade] || 0) + 1;
      }
      
      // Skills frequency
      if (edu.skills) {
        edu.skills.forEach(skill => {
          skillsFrequency[skill] = (skillsFrequency[skill] || 0) + 1;
        });
      }
    });

    return {
      total: education.length,
      inProgress,
      completed,
      institutions,
      degrees,
      fieldsOfStudy,
      totalDurationInYears: Math.round(totalDurationInYears * 10) / 10,
      averageDurationInYears: Math.round(averageDurationInYears * 10) / 10,
      mostRecentEducation: this.formatEducationResponse(mostRecent),
      longestEducation: this.formatEducationResponse(longestEducation),
      institutionCounts,
      degreeCounts,
      fieldOfStudyCounts,
      gradeDistribution,
      skillsFrequency,
    };
  }

  // Private helper methods
  private buildWhereClause(filters: EducationFilters): WhereOptions {
    const whereClause: WhereOptions = {};

    if (filters.profileId) {
      whereClause.profileId = filters.profileId;
    }

    if (filters.institution) {
      whereClause.institution = { [Op.iLike]: `%${filters.institution}%` };
    }

    if (filters.degree) {
      whereClause.degree = { [Op.iLike]: `%${filters.degree}%` };
    }

    if (filters.fieldOfStudy) {
      whereClause.fieldOfStudy = { [Op.iLike]: `%${filters.fieldOfStudy}%` };
    }

    if (filters.isCurrent !== undefined) {
      whereClause.isCurrent = filters.isCurrent;
    }

    if (filters.isCompleted !== undefined) {
      if (filters.isCompleted) {
        whereClause.isCurrent = false;
        whereClause.endDate = { [Op.ne]: null };
      } else {
        whereClause[Op.or as any] = [
          { isCurrent: true },
          { endDate: null }
        ];
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

    if (filters.hasGrade !== undefined) {
      whereClause.grade = filters.hasGrade ? { [Op.ne]: null } : null;
    }

    if (filters.hasDescription !== undefined) {
      whereClause.description = filters.hasDescription ? { [Op.ne]: null } : null;
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
        { institution: { [Op.iLike]: `%${filters.search}%` } },
        { degree: { [Op.iLike]: `%${filters.search}%` } },
        { fieldOfStudy: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    return whereClause;
  }

  private formatEducationResponse(education: Education): EducationResponseDto {
    const response: EducationResponseDto = {
      id: education.id,
      profileId: education.profileId,
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate.toISOString().split('T')[0],
      isCurrent: education.isCurrent,
      createdAt: education.createdAt.toISOString(),
      updatedAt: education.updatedAt.toISOString(),
      
      // Computed fields
      durationInMonths: education.getDurationInMonths(),
      durationInYears: education.getDurationInYears(),
      formattedDuration: education.getFormattedDuration(),
      isCompleted: education.isCompleted(),
      isInProgress: education.isInProgress(),
    };

    // Only include optional properties if they exist
    if (education.endDate) {
      response.endDate = education.endDate.toISOString().split('T')[0];
    }
    if (education.grade) {
      response.grade = education.grade;
    }
    if (education.description) {
      response.description = education.description;
    }
    if (education.achievements) {
      response.achievements = education.achievements;
    }
    if (education.skills) {
      response.skills = education.skills;
    }
    if (education.metadata) {
      response.metadata = education.metadata;
    }

    return response;
  }
}

export const educationService = new EducationService(); 
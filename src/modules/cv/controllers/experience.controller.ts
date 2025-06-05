import { Response } from 'express';
import createError from 'http-errors';
import { experienceService } from '../services/experience.service';
import { CreateExperienceDto, UpdateExperienceDto, ExperienceQueryParams } from '../types/experience.types';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';

export class ExperienceController extends BaseController {
  // Create experience
  async createExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const experienceData: CreateExperienceDto = this.getValidatedData(req);
      
      // For non-admin users, ensure they can only create experience for their own profile
      if (req.user!.role !== 'admin' && experienceData.profileId !== req.user!.id) {
        throw createError(403, 'Cannot create experience for other users', { code: 'FORBIDDEN' });
      }
      
      const result = await experienceService.createExperience(experienceData);
      this.sendSuccess(res, result, 'Experience created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create experience');
    }
  }

  // Get all experience (admin only)
  async getAllExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const queryParams: ExperienceQueryParams = req.query as any;
      const result = await experienceService.listExperience(queryParams);
      
      this.sendSuccess(res, result, 'Experience retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience');
    }
  }

  // Get user's own experience
  async getMyExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await experienceService.getExperienceByProfile(req.user!.id);
      this.sendSuccess(res, result, 'Experience retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience');
    }
  }

  // Get user's experience statistics
  async getMyExperienceStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await experienceService.getExperienceStats(req.user!.id);
      this.sendSuccess(res, result, 'Experience statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience statistics');
    }
  }

  // Get experience by ID
  async getExperienceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await experienceService.getExperienceById(id, profileId);
      
      this.sendSuccess(res, result, 'Experience retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience');
    }
  }

  // Update experience
  async updateExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateExperienceDto = this.getValidatedData(req);
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await experienceService.updateExperience(id, updateData, profileId);
      
      this.sendSuccess(res, result, 'Experience updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update experience');
    }
  }

  // Delete experience
  async deleteExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      await experienceService.deleteExperience(id, profileId);
      
      this.sendMessage(res, 'Experience deleted successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete experience');
    }
  }

  // Get current experience (admin only)
  async getCurrentExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const result = await experienceService.getCurrentExperience();
      this.sendSuccess(res, result, 'Current experience retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve current experience');
    }
  }

  // Get experience by company (admin only)
  async getExperienceByCompany(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const { company } = req.params;
      const result = await experienceService.getExperienceByCompany(company);
      
      this.sendSuccess(res, result, 'Experience by company retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience by company');
    }
  }

  // Get experience by profile ID (admin only)
  async getExperienceByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const { profileId } = req.params;
      const result = await experienceService.getExperienceByProfile(profileId);
      
      this.sendSuccess(res, result, 'Experience by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience by profile');
    }
  }

  // Get experience statistics by profile ID (admin only)
  async getExperienceStatsByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const { profileId } = req.params;
      const result = await experienceService.getExperienceStats(profileId);
      
      this.sendSuccess(res, result, 'Experience statistics by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve experience statistics by profile');
    }
  }

  // Get global experience statistics (admin only)
  async getAllExperienceStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user!.role !== 'admin') {
        throw createError(403, 'Admin access required', { code: 'FORBIDDEN' });
      }

      const result = await experienceService.getExperienceStats();
      this.sendSuccess(res, result, 'Global experience statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve global experience statistics');
    }
  }
}

export const experienceController = new ExperienceController(); 
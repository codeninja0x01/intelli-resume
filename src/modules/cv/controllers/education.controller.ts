import { Response } from 'express';
import createError from 'http-errors';
import { educationService } from '../services/education.service';
import { CreateEducationDto, UpdateEducationDto, EducationQueryParams } from '../types/education.types';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';

export class EducationController extends BaseController {
  // Create education
  async createEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const educationData: CreateEducationDto = this.getValidatedData(req);
      
      // For non-admin users, ensure they can only create education for their own profile
      if (req.user!.role !== 'admin' && educationData.profileId !== req.user!.id) {
        throw createError(403, 'Cannot create education for other users', { code: 'FORBIDDEN' });
      }
      
      const result = await educationService.createEducation(educationData);
      this.sendSuccess(res, result, 'Education created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create education');
    }
  }

  // Get all education (admin only)
  async getAllEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const queryParams: EducationQueryParams = req.query as any;
      const result = await educationService.listEducation(queryParams);
      
      this.sendSuccess(res, result, 'Education retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education');
    }
  }

  // Get user's own education
  async getMyEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await educationService.getEducationByProfile(req.user!.id);
      this.sendSuccess(res, result, 'Education retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education');
    }
  }

  // Get user's education statistics
  async getMyEducationStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await educationService.getEducationStats(req.user!.id);
      this.sendSuccess(res, result, 'Education statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education statistics');
    }
  }

  // Get education by ID
  async getEducationById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await educationService.getEducationById(id, profileId);
      
      this.sendSuccess(res, result, 'Education retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education');
    }
  }

  // Update education
  async updateEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateEducationDto = this.getValidatedData(req);
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await educationService.updateEducation(id, updateData, profileId);
      
      this.sendSuccess(res, result, 'Education updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update education');
    }
  }

  // Delete education
  async deleteEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      await educationService.deleteEducation(id, profileId);
      
      this.sendMessage(res, 'Education deleted successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete education');
    }
  }

  // Get current education (admin only)
  async getCurrentEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await educationService.getCurrentEducation();
      this.sendSuccess(res, result, 'Current education retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve current education');
    }
  }

  // Get education by institution (admin only)
  async getEducationByInstitution(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { institution } = req.params;
      const result = await educationService.getEducationByInstitution(institution);
      
      this.sendSuccess(res, result, 'Education by institution retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education by institution');
    }
  }

  // Get education by profile ID (admin only)
  async getEducationByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await educationService.getEducationByProfile(profileId);
      
      this.sendSuccess(res, result, 'Education by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education by profile');
    }
  }

  // Get education statistics by profile ID (admin only)
  async getEducationStatsByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await educationService.getEducationStats(profileId);
      
      this.sendSuccess(res, result, 'Education statistics by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve education statistics by profile');
    }
  }

  // Get global education statistics (admin only)
  async getAllEducationStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await educationService.getEducationStats();
      this.sendSuccess(res, result, 'Global education statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve global education statistics');
    }
  }
}

export const educationController = new EducationController(); 
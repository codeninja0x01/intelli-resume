import { Response } from 'express';
import createError from 'http-errors';
import { skillService } from '../services/skill.service';
import { CreateSkillDto, UpdateSkillDto, SkillQueryParams } from '../types/skill.types';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';

export class SkillController extends BaseController {
  // Create skill
  async createSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const skillData: CreateSkillDto = this.getValidatedData(req);
      
      // For non-admin users, ensure they can only create skills for their own profile
      if (req.user!.role !== 'admin' && skillData.profileId !== req.user!.id) {
        throw createError(403, 'Cannot create skill for other users', { code: 'FORBIDDEN' });
      }
      
      const result = await skillService.createSkill(skillData);
      this.sendSuccess(res, result, 'Skill created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create skill');
    }
  }

  // Get all skills (admin only)
  async getAllSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const queryParams: SkillQueryParams = req.query as any;
      const result = await skillService.listSkills(queryParams);
      
      this.sendSuccess(res, result, 'Skills retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills');
    }
  }

  // Get user's own skills
  async getMySkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await skillService.getSkillsByProfile(req.user!.id);
      this.sendSuccess(res, result, 'Skills retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills');
    }
  }

  // Get user's skill statistics
  async getMySkillStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await skillService.getSkillStats(req.user!.id);
      this.sendSuccess(res, result, 'Skill statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skill statistics');
    }
  }

  // Get skill by ID
  async getSkillById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getSkillById(id, profileId);
      
      this.sendSuccess(res, result, 'Skill retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skill');
    }
  }

  // Update skill
  async updateSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateSkillDto = this.getValidatedData(req);
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.updateSkill(id, updateData, profileId);
      
      this.sendSuccess(res, result, 'Skill updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update skill');
    }
  }

  // Delete skill
  async deleteSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      await skillService.deleteSkill(id, profileId);
      
      this.sendMessage(res, 'Skill deleted successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete skill');
    }
  }

  // Get skills by category
  async getSkillsByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getSkillsByCategory(category, profileId);
      
      this.sendSuccess(res, result, 'Skills by category retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills by category');
    }
  }

  // Get skills by level
  async getSkillsByLevel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { level } = req.params;
      
      if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
        throw createError(400, 'Invalid skill level', { code: 'INVALID_LEVEL' });
      }
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getSkillsByLevel(level as any, profileId);
      
      this.sendSuccess(res, result, 'Skills by level retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills by level');
    }
  }

  // Get expert skills
  async getExpertSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getExpertSkills(profileId);
      
      this.sendSuccess(res, result, 'Expert skills retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve expert skills');
    }
  }

  // Get unique categories
  async getUniqueCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getUniqueCategories(profileId);
      
      this.sendSuccess(res, result, 'Skill categories retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skill categories');
    }
  }

  // Get skills grouped by categories
  async getSkillsByCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await skillService.getSkillsByCategories(profileId);
      
      this.sendSuccess(res, result, 'Skills by categories retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills by categories');
    }
  }

  // Get skills by profile ID (admin only)
  async getSkillsByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await skillService.getSkillsByProfile(profileId);
      
      this.sendSuccess(res, result, 'Skills by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skills by profile');
    }
  }

  // Get skill statistics by profile ID (admin only)
  async getSkillStatsByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await skillService.getSkillStats(profileId);
      
      this.sendSuccess(res, result, 'Skill statistics by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve skill statistics by profile');
    }
  }

  // Get global skill statistics (admin only)
  async getAllSkillStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await skillService.getSkillStats();
      this.sendSuccess(res, result, 'Global skill statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve global skill statistics');
    }
  }

  // Get my skills grouped by categories
  async getMySkillsByCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await skillService.getSkillsByCategories(req.user!.id);
      this.sendSuccess(res, result, 'My skills by categories retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve my skills by categories');
    }
  }

  // Get my expert skills
  async getMyExpertSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await skillService.getExpertSkills(req.user!.id);
      this.sendSuccess(res, result, 'My expert skills retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve my expert skills');
    }
  }
}

export const skillController = new SkillController(); 
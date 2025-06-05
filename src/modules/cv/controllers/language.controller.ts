import { Response } from 'express';
import createError from 'http-errors';
import { languageService } from '../services/language.service';
import { CreateLanguageDto, UpdateLanguageDto, LanguageQueryParams } from '../types/language.types';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';

export class LanguageController extends BaseController {
  // Create language
  async createLanguage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const languageData: CreateLanguageDto = this.getValidatedData(req);
      
      // For non-admin users, ensure they can only create languages for their own profile
      if (req.user!.role !== 'admin' && languageData.profileId !== req.user!.id) {
        throw createError(403, 'Cannot create language for other users', { code: 'FORBIDDEN' });
      }
      
      const result = await languageService.createLanguage(languageData);
      this.sendSuccess(res, result, 'Language created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create language');
    }
  }

  // Get all languages (admin only)
  async getAllLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const queryParams: LanguageQueryParams = req.query as any;
      const result = await languageService.listLanguages(queryParams);
      
      this.sendSuccess(res, result, 'Languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages');
    }
  }

  // Get user's own languages
  async getMyLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getLanguagesByProfile(req.user!.id);
      this.sendSuccess(res, result, 'Languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages');
    }
  }

  // Get user's language statistics
  async getMyLanguageStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getLanguageStats(req.user!.id);
      this.sendSuccess(res, result, 'Language statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve language statistics');
    }
  }

  // Get language by ID
  async getLanguageById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getLanguageById(id, profileId);
      
      this.sendSuccess(res, result, 'Language retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve language');
    }
  }

  // Update language
  async updateLanguage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateLanguageDto = this.getValidatedData(req);
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.updateLanguage(id, updateData, profileId);
      
      this.sendSuccess(res, result, 'Language updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update language');
    }
  }

  // Delete language
  async deleteLanguage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      await languageService.deleteLanguage(id, profileId);
      
      this.sendMessage(res, 'Language deleted successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete language');
    }
  }

  // Get languages by proficiency level
  async getLanguagesByProficiency(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { level } = req.params;
      
      if (!['basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'].includes(level)) {
        throw createError(400, 'Invalid proficiency level', { code: 'INVALID_PROFICIENCY' });
      }
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getLanguagesByProficiency(level as any, profileId);
      
      this.sendSuccess(res, result, 'Languages by proficiency retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages by proficiency');
    }
  }

  // Get native languages
  async getNativeLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getNativeLanguages(profileId);
      
      this.sendSuccess(res, result, 'Native languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve native languages');
    }
  }

  // Get fluent languages
  async getFluentLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getFluentLanguages(profileId);
      
      this.sendSuccess(res, result, 'Fluent languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve fluent languages');
    }
  }

  // Get languages by language code
  async getLanguagesByCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getLanguagesByCode(code, profileId);
      
      this.sendSuccess(res, result, 'Languages by code retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages by code');
    }
  }

  // Get unique language codes
  async getUniqueLanguageCodes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getUniqueLanguageCodes(profileId);
      
      this.sendSuccess(res, result, 'Language codes retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve language codes');
    }
  }

  // Get unique language names
  async getUniqueLanguageNames(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getUniqueLanguageNames(profileId);
      
      this.sendSuccess(res, result, 'Language names retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve language names');
    }
  }

  // Get languages grouped by proficiency levels
  async getLanguagesByProficiencyLevels(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // For non-admin users, filter by their profile ID
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      const result = await languageService.getLanguagesByProficiencyLevels(profileId);
      
      this.sendSuccess(res, result, 'Languages by proficiency levels retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages by proficiency levels');
    }
  }

  // Get languages by profile ID (admin only)
  async getLanguagesByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await languageService.getLanguagesByProfile(profileId);
      
      this.sendSuccess(res, result, 'Languages by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve languages by profile');
    }
  }

  // Get language statistics by profile ID (admin only)
  async getLanguageStatsByProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const result = await languageService.getLanguageStats(profileId);
      
      this.sendSuccess(res, result, 'Language statistics by profile retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve language statistics by profile');
    }
  }

  // Get global language statistics (admin only)
  async getAllLanguageStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getLanguageStats();
      this.sendSuccess(res, result, 'Global language statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve global language statistics');
    }
  }

  // Get my native languages
  async getMyNativeLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getNativeLanguages(req.user!.id);
      this.sendSuccess(res, result, 'My native languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve my native languages');
    }
  }

  // Get my fluent languages
  async getMyFluentLanguages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getFluentLanguages(req.user!.id);
      this.sendSuccess(res, result, 'My fluent languages retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve my fluent languages');
    }
  }

  // Get my languages grouped by proficiency levels
  async getMyLanguagesByProficiencyLevels(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await languageService.getLanguagesByProficiencyLevels(req.user!.id);
      this.sendSuccess(res, result, 'My languages by proficiency levels retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve my languages by proficiency levels');
    }
  }
}

export const languageController = new LanguageController(); 
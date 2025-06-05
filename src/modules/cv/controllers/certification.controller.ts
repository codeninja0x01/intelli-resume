import { Request, Response } from 'express';
import { certificationService } from '../services/certification.service';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
  CertificationQueryParams,
} from '../types/certification.types';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { BaseController } from '@/modules/base.controller';

export class CertificationController extends BaseController {
  /**
   * Create a new certification
   */
  async createCertification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data: CreateCertificationDto = this.getValidatedData(req);
      
      const certification = await certificationService.createCertification(data);
      
      this.sendSuccess(res, certification, 'Certification created successfully', 201);
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create certification');
    }
  }

  /**
   * Get certification by ID
   */
  async getCertification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = this.getValidatedData(req);
      
      const certification = await certificationService.getCertificationById(id);
      
      this.sendSuccess(res, certification, 'Certification retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get certification');
    }
  }

  /**
   * Update certification
   */
  async updateCertification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id, ...updateData }: { id: string } & UpdateCertificationDto = this.getValidatedData(req);
      
      // For regular users, restrict to their own profile's certifications
      // Admins can update any certification
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      
      const certification = await certificationService.updateCertification(id, updateData, profileId);
      
      this.sendSuccess(res, certification, 'Certification updated successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update certification');
    }
  }

  /**
   * Delete certification
   */
  async deleteCertification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = this.getValidatedData(req);
      
      // For regular users, restrict to their own profile's certifications
      const profileId = req.user!.role === 'admin' ? undefined : req.user!.id;
      
      await certificationService.deleteCertification(id, profileId);
      
      this.sendMessage(res, 'Certification deleted successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete certification');
    }
  }

  /**
   * List certifications with filtering and pagination
   */
  async listCertifications(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: CertificationQueryParams = this.getValidatedData(req);
      
      const result = await certificationService.listCertifications(queryParams);
      
      this.sendSuccess(res, result, 'Certifications retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to list certifications');
    }
  }

  /**
   * Get certifications by profile ID
   */
  async getCertificationsByProfile(req: Request, res: Response): Promise<void> {
    try {
      const data = this.getValidatedData(req);
      const { profileId, includeExpired = true, sortBy = 'issueDate', sortOrder = 'DESC' } = data;
      
      const certifications = await certificationService.getCertificationsByProfile(profileId, {
        includeExpired,
        sortBy,
        sortOrder,
      });
      
      this.sendSuccess(res, certifications, 'Profile certifications retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get profile certifications');
    }
  }

  /**
   * Get current user's certifications
   */
  async getMyCertifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const queryData = this.getValidatedData(req);
      const { includeExpired = true, sortBy = 'issueDate', sortOrder = 'DESC' } = queryData;
      
      const certifications = await certificationService.getCertificationsByProfile(req.user!.id, {
        includeExpired,
        sortBy,
        sortOrder,
      });
      
      this.sendSuccess(res, certifications, 'Your certifications retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get your certifications');
    }
  }

  /**
   * Get valid certifications (not expired)
   */
  async getValidCertifications(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.query;
      
      const certifications = await certificationService.getValidCertifications(profileId as string);
      
      this.sendSuccess(res, certifications, 'Valid certifications retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get valid certifications');
    }
  }

  /**
   * Get certifications expiring soon
   */
  async getExpiringCertifications(req: Request, res: Response): Promise<void> {
    try {
      const { days = 30, profileId } = req.query;
      
      const certifications = await certificationService.getExpiringCertifications(
        Number(days),
        profileId as string
      );
      
      this.sendSuccess(res, certifications, 'Expiring certifications retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get expiring certifications');
    }
  }

  /**
   * Get certification statistics for a profile
   */
  async getCertificationStats(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = this.getValidatedData(req);
      
      const stats = await certificationService.getCertificationStats(profileId);
      
      this.sendSuccess(res, stats, 'Certification statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get certification statistics');
    }
  }

  /**
   * Get current user's certification statistics
   */
  async getMyCertificationStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await certificationService.getCertificationStats(req.user!.id);
      
      this.sendSuccess(res, stats, 'Your certification statistics retrieved successfully');
    } catch (error: any) {
      this.handleError(error, res, 'Failed to get your certification statistics');
    }
  }
}

export const certificationController = new CertificationController(); 
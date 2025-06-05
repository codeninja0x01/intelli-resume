import { Op } from 'sequelize';
import createError from 'http-errors';
import { Certification } from '../models/Certification.model';
import { Profile } from '../models/Profile.model';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
  CertificationResponseDto,
  CertificationFilters,
  CertificationQueryParams,
  CertificationListResponse,
} from '../types/certification.types';

export class CertificationService {
  /**
   * Create a new certification
   */
  async createCertification(data: CreateCertificationDto): Promise<CertificationResponseDto> {
    // Verify profile exists
    const profile = await Profile.findByPk(data.profileId);
    if (!profile) {
      throw createError(404, 'Profile not found', {
        code: 'PROFILE_NOT_FOUND',
        details: { profileId: data.profileId },
      });
    }

    // Validate date logic
    if (data.expiryDate && data.issueDate) {
      const issueDate = new Date(data.issueDate);
      const expiryDate = new Date(data.expiryDate);
      
      if (expiryDate <= issueDate) {
        throw createError(400, 'Expiry date must be after issue date', {
          code: 'INVALID_DATE_RANGE',
          details: { issueDate: data.issueDate, expiryDate: data.expiryDate },
        });
      }
    }

    const certification = await Certification.create({
      profileId: data.profileId,
      name: data.name,
      issuer: data.issuer,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate,
      credentialId: data.credentialId,
      credentialUrl: data.credentialUrl,
      description: data.description,
      metadata: data.metadata,
    });
    return this.formatCertificationResponse(certification);
  }

  /**
   * Get certification by ID
   */
  async getCertificationById(id: string): Promise<CertificationResponseDto> {
    const certification = await Certification.findByPk(id, {
      include: [{ model: Profile, as: 'profile' }],
    });

    if (!certification) {
      throw createError(404, 'Certification not found', {
        code: 'CERTIFICATION_NOT_FOUND',
        details: { certificationId: id },
      });
    }

    return this.formatCertificationResponse(certification);
  }

  /**
   * Update certification
   */
  async updateCertification(
    id: string,
    data: UpdateCertificationDto,
    profileId?: string
  ): Promise<CertificationResponseDto> {
    const certification = await Certification.findByPk(id);

    if (!certification) {
      throw createError(404, 'Certification not found', {
        code: 'CERTIFICATION_NOT_FOUND',
        details: { certificationId: id },
      });
    }

    // Check ownership if profileId is provided (for user-level access control)
    if (profileId && certification.profileId !== profileId) {
      throw createError(403, 'Access denied to this certification', {
        code: 'CERTIFICATION_ACCESS_DENIED',
        details: { certificationId: id, userProfileId: profileId },
      });
    }

    // Validate date logic if both dates are being updated
    const finalIssueDate = data.issueDate || certification.issueDate.toISOString().split('T')[0];
    const finalExpiryDate = data.expiryDate || (certification.expiryDate?.toISOString().split('T')[0]);

    if (finalExpiryDate && finalIssueDate) {
      const issueDate = new Date(finalIssueDate);
      const expiryDate = new Date(finalExpiryDate);
      
      if (expiryDate <= issueDate) {
        throw createError(400, 'Expiry date must be after issue date', {
          code: 'INVALID_DATE_RANGE',
          details: { issueDate: finalIssueDate, expiryDate: finalExpiryDate },
        });
      }
    }

    await certification.update(data);
    return this.formatCertificationResponse(certification);
  }

  /**
   * Delete certification
   */
  async deleteCertification(id: string, profileId?: string): Promise<void> {
    const certification = await Certification.findByPk(id);

    if (!certification) {
      throw createError(404, 'Certification not found', {
        code: 'CERTIFICATION_NOT_FOUND',
        details: { certificationId: id },
      });
    }

    // Check ownership if profileId is provided
    if (profileId && certification.profileId !== profileId) {
      throw createError(403, 'Access denied to this certification', {
        code: 'CERTIFICATION_ACCESS_DENIED',
        details: { certificationId: id, userProfileId: profileId },
      });
    }

    await certification.destroy();
  }

  /**
   * Get certifications by profile ID
   */
  async getCertificationsByProfile(
    profileId: string,
    options: {
      includeExpired?: boolean;
      sortBy?: 'name' | 'issuer' | 'issueDate' | 'expiryDate' | 'createdAt';
      sortOrder?: 'ASC' | 'DESC';
    } = {}
  ): Promise<CertificationResponseDto[]> {
    // Verify profile exists
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      throw createError(404, 'Profile not found', {
        code: 'PROFILE_NOT_FOUND',
        details: { profileId },
      });
    }

    const {
      includeExpired = true,
      sortBy = 'issueDate',
      sortOrder = 'DESC',
    } = options;

    const whereClause: any = { profileId };

    // Filter out expired certifications if requested
    if (!includeExpired) {
      whereClause[Op.or] = [
        { expiryDate: null },
        { expiryDate: { [Op.gt]: new Date() } },
      ];
    }

    const certifications = await Certification.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
    });

    return certifications.map(cert => this.formatCertificationResponse(cert));
  }

  /**
   * List certifications with filtering and pagination
   */
  async listCertifications(params: CertificationQueryParams): Promise<CertificationListResponse> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filters = {},
    } = params;

    const offset = (page - 1) * limit;
    const whereClause = this.buildWhereClause(filters);

    const { count, rows } = await Certification.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      include: [{ model: Profile, as: 'profile' }],
    });

    const certifications = rows.map(cert => this.formatCertificationResponse(cert));
    const totalPages = Math.ceil(count / limit);

    return {
      certifications,
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

  /**
   * Get valid certifications (not expired)
   */
  async getValidCertifications(profileId?: string): Promise<CertificationResponseDto[]> {
    const certifications = await Certification.findValidCertifications(profileId);
    return certifications.map(cert => this.formatCertificationResponse(cert));
  }

  /**
   * Get certifications expiring soon
   */
  async getExpiringCertifications(
    days: number = 30,
    profileId?: string
  ): Promise<CertificationResponseDto[]> {
    const certifications = await Certification.findExpiringCertifications(days, profileId);
    return certifications.map(cert => this.formatCertificationResponse(cert));
  }

  /**
   * Get certification statistics for a profile
   */
  async getCertificationStats(profileId: string): Promise<{
    total: number;
    valid: number;
    expired: number;
    expiringSoon: number;
    topIssuers: Array<{ issuer: string; count: number }>;
  }> {
    // Verify profile exists
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      throw createError(404, 'Profile not found', {
        code: 'PROFILE_NOT_FOUND',
        details: { profileId },
      });
    }

    const allCertifications = await Certification.findByProfileId(profileId);
    const validCertifications = allCertifications.filter(cert => cert.isValid());
    const expiredCertifications = allCertifications.filter(cert => cert.isExpired());
    const expiringSoonCertifications = allCertifications.filter(cert => {
      const daysUntilExpiry = cert.getDaysUntilExpiry();
      return daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    // Get top issuers
    const issuerCounts: Record<string, number> = {};
    allCertifications.forEach(cert => {
      issuerCounts[cert.issuer] = (issuerCounts[cert.issuer] || 0) + 1;
    });

    const topIssuers = Object.entries(issuerCounts)
      .map(([issuer, count]) => ({ issuer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: allCertifications.length,
      valid: validCertifications.length,
      expired: expiredCertifications.length,
      expiringSoon: expiringSoonCertifications.length,
      topIssuers,
    };
  }

  /**
   * Build where clause for filtering
   */
  private buildWhereClause(filters: CertificationFilters): any {
    const whereClause: any = {};

    if (filters.profileId) {
      whereClause.profileId = filters.profileId;
    }

    if (filters.issuer) {
      whereClause.issuer = { [Op.iLike]: `%${filters.issuer}%` };
    }

    if (filters.name) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { issuer: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    if (filters.isExpired !== undefined) {
      if (filters.isExpired) {
        whereClause.expiryDate = { [Op.lt]: new Date() };
      } else {
        whereClause[Op.or] = [
          { expiryDate: null },
          { expiryDate: { [Op.gte]: new Date() } },
        ];
      }
    }

    if (filters.expiringWithinDays !== undefined) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + filters.expiringWithinDays);
      
      whereClause.expiryDate = {
        [Op.and]: [
          { [Op.gte]: new Date() },
          { [Op.lte]: futureDate },
        ],
      };
    }

    return whereClause;
  }

  /**
   * Format certification for API response
   */
  private formatCertificationResponse(certification: Certification): CertificationResponseDto {
    return {
      id: certification.id,
      profileId: certification.profileId,
      name: certification.name,
      issuer: certification.issuer,
      issueDate: certification.issueDate.toISOString().split('T')[0],
      expiryDate: certification.expiryDate?.toISOString().split('T')[0] || undefined,
      credentialId: certification.credentialId || undefined,
      credentialUrl: certification.credentialUrl || undefined,
      description: certification.description || undefined,
      metadata: certification.metadata || undefined,
      createdAt: certification.createdAt.toISOString(),
      updatedAt: certification.updatedAt.toISOString(),
      deletedAt: certification.deletedAt?.toISOString() || undefined,
      // Computed fields
      isExpired: certification.isExpired(),
      isValid: certification.isValid(),
      daysUntilExpiry: certification.getDaysUntilExpiry(),
    };
  }
}

export const certificationService = new CertificationService(); 
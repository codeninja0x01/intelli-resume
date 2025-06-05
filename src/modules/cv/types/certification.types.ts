export interface CreateCertificationDto {
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string; // YYYY-MM-DD format
  expiryDate?: string; // YYYY-MM-DD format
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateCertificationDto {
  name?: string;
  issuer?: string;
  issueDate?: string; // YYYY-MM-DD format
  expiryDate?: string; // YYYY-MM-DD format
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CertificationResponseDto {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | undefined;
  credentialId?: string | undefined;
  credentialUrl?: string | undefined;
  description?: string | undefined;
  metadata?: Record<string, any> | undefined;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | undefined;
  // Computed fields
  isExpired?: boolean;
  isValid?: boolean;
  daysUntilExpiry?: number | null;
}

export interface CertificationFilters {
  profileId?: string;
  issuer?: string;
  name?: string;
  isExpired?: boolean;
  isValid?: boolean;
  expiringWithinDays?: number;
  search?: string; // Search across name, issuer, description
}

export interface CertificationQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'issuer' | 'issueDate' | 'expiryDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  filters?: CertificationFilters;
}

export interface CertificationListResponse {
  certifications: CertificationResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: CertificationFilters;
} 
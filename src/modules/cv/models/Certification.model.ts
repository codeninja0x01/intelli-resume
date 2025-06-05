import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Length,
  IsUrl,
} from 'sequelize-typescript';
import { Profile } from './Profile.model';

@Table({
  tableName: 'certifications',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['profile_id'] },
    { fields: ['issuer'] },
    { fields: ['issue_date'] },
    { fields: ['expiry_date'] },
    { fields: ['created_at'] },
  ],
})
export class Certification extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public override id!: string;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.UUID)
  public profileId!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public name!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public issuer!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  public issueDate!: Date;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  public expiryDate?: Date;

  @AllowNull(true)
  @Length({ max: 255 })
  @Column(DataType.STRING)
  public credentialId?: string;

  @AllowNull(true)
  @IsUrl
  @Length({ max: 2048 })
  @Column(DataType.TEXT)
  public credentialUrl?: string;

  @AllowNull(true)
  @Length({ max: 1000 })
  @Column(DataType.TEXT)
  public description?: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  public metadata?: Record<string, any>;

  @CreatedAt
  public override readonly createdAt!: Date;

  @UpdatedAt
  public override readonly updatedAt!: Date;

  @DeletedAt
  public override readonly deletedAt?: Date;

  // Associations
  @BelongsTo(() => Profile)
  public profile!: Profile;

  // Instance methods
  public isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > new Date(this.expiryDate);
  }

  public isValid(): boolean {
    if (!this.issueDate) return false;
    const issueDate = new Date(this.issueDate);
    const now = new Date();
    
    // Must be issued in the past or today
    if (issueDate > now) return false;
    
    // If has expiry date, must not be expired
    if (this.expiryDate && this.isExpired()) return false;
    
    return true;
  }

  public getDaysUntilExpiry(): number | null {
    if (!this.expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Static methods
  static async findByProfileId(profileId: string): Promise<Certification[]> {
    return this.findAll({
      where: { profileId },
      order: [['issueDate', 'DESC']],
    });
  }

  static async findValidCertifications(profileId?: string): Promise<Certification[]> {
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const certifications = await this.findAll({
      where: whereClause,
      order: [['issueDate', 'DESC']],
    });

    return certifications.filter(cert => cert.isValid());
  }

  static async findExpiringCertifications(days: number = 30, profileId?: string): Promise<Certification[]> {
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const certifications = await this.findAll({
      where: whereClause,
      order: [['expiryDate', 'ASC']],
    });

    return certifications.filter(cert => {
      const daysUntilExpiry = cert.getDaysUntilExpiry();
      return daysUntilExpiry !== null && daysUntilExpiry <= days && daysUntilExpiry > 0;
    });
  }
} 
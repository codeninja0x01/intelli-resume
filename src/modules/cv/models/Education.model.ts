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
} from 'sequelize-typescript';
import { Profile } from './Profile.model';

@Table({
  tableName: 'education',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['profile_id'] },
    { fields: ['institution'] },
    { fields: ['start_date'] },
    { fields: ['end_date'] },
    { fields: ['is_current'] },
    { fields: ['created_at'] },
  ],
})
export class Education extends Model {
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
  public institution!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public degree!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public fieldOfStudy!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  public startDate!: Date;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  public endDate?: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isCurrent!: boolean;

  @AllowNull(true)
  @Length({ max: 50 })
  @Column(DataType.STRING)
  public grade?: string;

  @AllowNull(true)
  @Length({ max: 1000 })
  @Column(DataType.TEXT)
  public description?: string;

  @AllowNull(true)
  @Column(DataType.JSON)
  public achievements?: string[];

  @AllowNull(true)
  @Column(DataType.JSON)
  public skills?: string[];

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
  public getDurationInMonths(): number {
    const start = new Date(this.startDate);
    const end = this.isCurrent ? new Date() : new Date(this.endDate || new Date());
    
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    
    return yearDiff * 12 + monthDiff;
  }

  public getDurationInYears(): number {
    return Math.round((this.getDurationInMonths() / 12) * 10) / 10;
  }

  public isCompleted(): boolean {
    return !this.isCurrent && !!this.endDate;
  }

  public isInProgress(): boolean {
    return this.isCurrent;
  }

  public getFormattedDuration(): string {
    const months = this.getDurationInMonths();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }

  // Static methods
  static async findByProfileId(profileId: string): Promise<Education[]> {
    return this.findAll({
      where: { profileId },
      order: [['startDate', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  static async findCurrentEducation(profileId?: string): Promise<Education[]> {
    const whereClause: any = { isCurrent: true };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }

  static async findByInstitution(institution: string, profileId?: string): Promise<Education[]> {
    const whereClause: any = { institution };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }

  static async findByDegree(degree: string, profileId?: string): Promise<Education[]> {
    const whereClause: any = { degree };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }
} 
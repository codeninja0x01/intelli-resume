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
  tableName: 'experiences',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['profile_id'] },
    { fields: ['company'] },
    { fields: ['title'] },
    { fields: ['start_date'] },
    { fields: ['end_date'] },
    { fields: ['is_current'] },
    { fields: ['created_at'] },
  ],
})
export class Experience extends Model {
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
  public title!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public company!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING)
  public location!: string;

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

  @AllowNull(false)
  @Length({ min: 1, max: 2000 })
  @Column(DataType.TEXT)
  public description!: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  public responsibilities!: string[];

  @AllowNull(false)
  @Column(DataType.JSON)
  public achievements!: string[];

  @AllowNull(false)
  @Column(DataType.JSON)
  public skills!: string[];

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

  public isCurrentPosition(): boolean {
    return this.isCurrent;
  }

  public isPastPosition(): boolean {
    return !this.isCurrent && !!this.endDate;
  }

  public getFormattedDuration(): string {
    const months = this.getDurationInMonths();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (months < 1) {
      return 'Less than 1 month';
    } else if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }

  public getTotalResponsibilitiesCount(): number {
    return this.responsibilities ? this.responsibilities.length : 0;
  }

  public getTotalAchievementsCount(): number {
    return this.achievements ? this.achievements.length : 0;
  }

  public getTotalSkillsCount(): number {
    return this.skills ? this.skills.length : 0;
  }

  // Static methods
  static async findByProfileId(profileId: string): Promise<Experience[]> {
    return this.findAll({
      where: { profileId },
      order: [['startDate', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  static async findCurrentExperiences(profileId?: string): Promise<Experience[]> {
    const whereClause: any = { isCurrent: true };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }

  static async findByCompany(company: string, profileId?: string): Promise<Experience[]> {
    const whereClause: any = { company };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }

  static async findByTitle(title: string, profileId?: string): Promise<Experience[]> {
    const whereClause: any = { title };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }

  static async findByLocation(location: string, profileId?: string): Promise<Experience[]> {
    const whereClause: any = { location };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']],
    });
  }
} 
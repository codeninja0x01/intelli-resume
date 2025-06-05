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
  tableName: 'skills',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['profile_id'] },
    { fields: ['name'] },
    { fields: ['category'] },
    { fields: ['level'] },
    { fields: ['years_of_experience'] },
    { fields: ['created_at'] },
  ],
})
export class Skill extends Model {
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
  @Length({ min: 1, max: 100 })
  @Column(DataType.STRING)
  public category!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('beginner', 'intermediate', 'advanced', 'expert'))
  public level!: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @AllowNull(true)
  @Column(DataType.INTEGER)
  public yearsOfExperience?: number;

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
  public isBeginnerLevel(): boolean {
    return this.level === 'beginner';
  }

  public isIntermediateLevel(): boolean {
    return this.level === 'intermediate';
  }

  public isAdvancedLevel(): boolean {
    return this.level === 'advanced';
  }

  public isExpertLevel(): boolean {
    return this.level === 'expert';
  }

  public getLevelNumeric(): number {
    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    return levelMap[this.level];
  }

  public getFormattedExperience(): string {
    if (!this.yearsOfExperience) {
      return 'Experience not specified';
    }
    
    const years = this.yearsOfExperience;
    if (years < 1) {
      return 'Less than 1 year';
    } else if (years === 1) {
      return '1 year';
    } else {
      return `${years} years`;
    }
  }

  public hasDescription(): boolean {
    return !!this.description && this.description.trim().length > 0;
  }

  public hasMetadata(): boolean {
    return !!this.metadata && Object.keys(this.metadata).length > 0;
  }

  // Static methods
  static async findByProfileId(profileId: string): Promise<Skill[]> {
    return this.findAll({
      where: { profileId },
      order: [['level', 'DESC'], ['yearsOfExperience', 'DESC'], ['name', 'ASC']],
    });
  }

  static async findByCategory(category: string, profileId?: string): Promise<Skill[]> {
    const whereClause: any = { category };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['level', 'DESC'], ['yearsOfExperience', 'DESC'], ['name', 'ASC']],
    });
  }

  static async findByLevel(level: 'beginner' | 'intermediate' | 'advanced' | 'expert', profileId?: string): Promise<Skill[]> {
    const whereClause: any = { level };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['yearsOfExperience', 'DESC'], ['name', 'ASC']],
    });
  }

  static async findByName(name: string, profileId?: string): Promise<Skill[]> {
    const whereClause: any = { name };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['level', 'DESC'], ['yearsOfExperience', 'DESC']],
    });
  }

  static async findExpertSkills(profileId?: string): Promise<Skill[]> {
    return this.findByLevel('expert', profileId);
  }

  static async findAdvancedSkills(profileId?: string): Promise<Skill[]> {
    return this.findByLevel('advanced', profileId);
  }

  static async getUniqueCategories(profileId?: string): Promise<string[]> {
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const skills = await this.findAll({
      where: whereClause,
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']],
    });

    return skills.map(skill => skill.category);
  }

  static async getSkillsByExperienceRange(minYears: number, maxYears: number, profileId?: string): Promise<Skill[]> {
    const whereClause: any = {
      yearsOfExperience: {
        [require('sequelize').Op.between]: [minYears, maxYears],
      },
    };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['yearsOfExperience', 'DESC'], ['level', 'DESC'], ['name', 'ASC']],
    });
  }
}

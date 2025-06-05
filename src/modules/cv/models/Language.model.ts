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
  tableName: 'languages',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['profile_id'] },
    { fields: ['language_code'] },
    { fields: ['proficiency_level'] },
    { fields: ['is_native'] },
    { fields: ['created_at'] },
  ],
})
export class Language extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public override id!: string;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.UUID)
  public profileId!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column(DataType.STRING)
  public name!: string; // e.g., "English", "Spanish", "French"

  @AllowNull(false)
  @Length({ min: 2, max: 10 })
  @Column(DataType.STRING)
  public languageCode!: string; // ISO 639-1 codes: en, es, fr, etc.

  @AllowNull(false)
  @Column(DataType.ENUM('basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'))
  public proficiencyLevel!: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isNative!: boolean;

  // Detailed proficiency breakdown (optional)
  @AllowNull(true)
  @Column(DataType.ENUM('basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'))
  public speakingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';

  @AllowNull(true)
  @Column(DataType.ENUM('basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'))
  public writingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';

  @AllowNull(true)
  @Column(DataType.ENUM('basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'))
  public readingLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';

  @AllowNull(true)
  @Column(DataType.ENUM('basic', 'conversational', 'intermediate', 'advanced', 'fluent', 'native'))
  public listeningLevel?: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native';

  @AllowNull(true)
  @Length({ max: 500 })
  @Column(DataType.TEXT)
  public description?: string; // Additional context or certifications

  @AllowNull(true)
  @Column(DataType.JSONB)
  public metadata?: Record<string, any>; // Certifications, test scores, etc.

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
  public isBasicLevel(): boolean {
    return this.proficiencyLevel === 'basic';
  }

  public isConversationalLevel(): boolean {
    return this.proficiencyLevel === 'conversational';
  }

  public isIntermediateLevel(): boolean {
    return this.proficiencyLevel === 'intermediate';
  }

  public isAdvancedLevel(): boolean {
    return this.proficiencyLevel === 'advanced';
  }

  public isFluentLevel(): boolean {
    return this.proficiencyLevel === 'fluent';
  }

  public isNativeLevel(): boolean {
    return this.proficiencyLevel === 'native' || this.isNative;
  }

  public getProficiencyNumeric(): number {
    const levelMap = {
      basic: 1,
      conversational: 2,
      intermediate: 3,
      advanced: 4,
      fluent: 5,
      native: 6,
    };
    return levelMap[this.proficiencyLevel];
  }

  public getFormattedProficiency(): string {
    if (this.isNative) return 'Native';
    
    const levelLabels = {
      basic: 'Basic',
      conversational: 'Conversational',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      fluent: 'Fluent',
      native: 'Native',
    };
    
    return levelLabels[this.proficiencyLevel];
  }

  public hasDetailedProficiency(): boolean {
    return !!(this.speakingLevel || this.writingLevel || this.readingLevel || this.listeningLevel);
  }

  public getDetailedProficiency(): Record<string, string> | null {
    if (!this.hasDetailedProficiency()) return null;
    
    return {
      speaking: this.speakingLevel || this.proficiencyLevel,
      writing: this.writingLevel || this.proficiencyLevel,
      reading: this.readingLevel || this.proficiencyLevel,
      listening: this.listeningLevel || this.proficiencyLevel,
    };
  }

  // Static methods
  static async findByProfileId(profileId: string): Promise<Language[]> {
    return this.findAll({
      where: { profileId },
      order: [['isNative', 'DESC'], ['proficiencyLevel', 'DESC'], ['name', 'ASC']],
    });
  }

  static async findByLanguageCode(languageCode: string, profileId?: string): Promise<Language[]> {
    const whereClause: any = { languageCode };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['proficiencyLevel', 'DESC'], ['name', 'ASC']],
    });
  }

  static async findByProficiencyLevel(
    level: 'basic' | 'conversational' | 'intermediate' | 'advanced' | 'fluent' | 'native',
    profileId?: string
  ): Promise<Language[]> {
    const whereClause: any = { proficiencyLevel: level };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });
  }

  static async findNativeLanguages(profileId?: string): Promise<Language[]> {
    const whereClause: any = { isNative: true };
    if (profileId) whereClause.profileId = profileId;

    return this.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });
  }

  static async getUniqueLanguageCodes(profileId?: string): Promise<string[]> {
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const languages = await this.findAll({
      where: whereClause,
      attributes: ['languageCode'],
      group: ['languageCode'],
      order: [['languageCode', 'ASC']],
    });

    return languages.map(lang => lang.languageCode);
  }

  static async getUniqueLanguageNames(profileId?: string): Promise<string[]> {
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const languages = await this.findAll({
      where: whereClause,
      attributes: ['name'],
      group: ['name'],
      order: [['name', 'ASC']],
    });

    return languages.map(lang => lang.name);
  }
}
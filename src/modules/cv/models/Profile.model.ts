import 'reflect-metadata';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  IsEmail,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  Length,
  IsUrl,
  Min,
  Default,
  HasMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
})
export class Profile extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  override id!: string;

  @IsEmail
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      notEmpty: true,
    },
  })
  firstName!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      notEmpty: true,
    },
  })
  lastName!: string;

  // Computed field for full name - no database column needed
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 20],
    },
  })
  phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  })
  address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  })
  city?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  })
  state?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 20],
    },
  })
  postalCode?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  })
  country?: string;

  @Default(0)
  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  tokenBalance!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000],
    },
  })
  bio?: string;

  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
      len: [0, 255],
    },
  })
  linkedinUrl?: string;

  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
      len: [0, 255],
    },
  })
  githubUrl?: string;

  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
      len: [0, 255],
    },
  })
  portfolioUrl?: string;

  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
      len: [0, 255],
    },
  })
  profilePictureUrl?: string;

  // Backward compatibility virtual field for avatar_url
  get avatar_url(): string | undefined {
    return this.profilePictureUrl;
  }

  set avatar_url(value: string | undefined) {
    if (value !== undefined) {
      this.profilePictureUrl = value;
    }
  }

  @Column({
    type: DataType.STRING,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin']],
    },
  })
  role!: 'user' | 'admin';

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at!: Date;

  // Instance methods
  override toJSON() {
    const values = super.toJSON() as any;
    // Remove sensitive data if needed
    return values;
  }

  // Get user display name
  getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }

  // Get full name
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  // Update profile data
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    bio?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profilePictureUrl?: string;
    role?: 'user' | 'admin';
  }): Promise<Profile> {
    return this.update(data);
  }

  // Associations
  @HasMany(() => require('./Certification.model').Certification, 'profileId')
  public certifications!: any[];

  @HasMany(() => require('./Education.model').Education, 'profileId')
  public education!: any[];

  @HasMany(() => require('./Experience.model').Experience, 'profileId')
  public experiences!: any[];

  @HasMany(() => require('./Skill.model').Skill, 'profileId')
  public skills!: any[];

  @HasMany(() => require('./Language.model').Language, 'profileId')
  public languages!: any[];
}

export default Profile; 
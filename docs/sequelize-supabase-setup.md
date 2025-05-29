# Sequelize + Supabase Integration Guide

## 🚀 Overview

This integration combines the best of both worlds:
- **Supabase Auth**: Handles user authentication, JWT tokens, password reset
- **Sequelize ORM**: Manages database operations with TypeScript models, relationships, and migrations

## 📋 Prerequisites

1. Supabase project created and configured
2. Database URL from Supabase
3. Node.js >= 18.0.0

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install sequelize pg sequelize-typescript reflect-metadata
npm install --save-dev @types/pg sequelize-cli
```

### 2. Configure Environment Variables

Update your `.env` file:
```env
# Supabase Configuration (for Auth)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (for Sequelize)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

**To get your Database URL:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** and replace `[password]` with your database password

### 3. Database Schema Synchronization

The integration maintains the same table structure but uses Sequelize for operations:

```sql
-- This table is managed by Sequelize but compatible with Supabase
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🏗️ Architecture

### Authentication Flow
```
Client → Supabase Auth → JWT Token → Express Middleware → Sequelize Models
```

### Data Flow
```
1. User signs up/in via Supabase Auth
2. JWT token is returned to client
3. Client sends requests with JWT token
4. Express middleware validates token with Supabase
5. Controllers use Sequelize models for database operations
```

## 📁 File Structure

```
src/
├── config/
│   ├── database.ts          # Sequelize configuration
│   ├── supabase.ts          # Supabase client (Auth only)
│   └── index.ts             # General config
├── models/
│   ├── Profile.model.ts     # User profile Sequelize model
│   └── index.ts             # Model exports
├── services/
│   ├── auth.service.ts      # Authentication (Supabase + Sequelize)
│   ├── profile.service.ts   # Profile operations (Sequelize)
│   └── index.ts
├── middleware/
│   └── auth.middleware.ts   # JWT validation (Supabase)
└── controllers/
    └── auth.controller.ts   # HTTP handlers
```

## 🔧 Key Features

### 1. **Sequelize Model with Validation**
```typescript
@Table({
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
})
export class Profile extends Model {
  @PrimaryKey
  @IsUUID(4)
  override id!: string;

  @IsEmail
  @Unique
  @AllowNull(false)
  email!: string;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  name!: string;

  // ... more fields
}
```

### 2. **Profile Service with Advanced Queries**
```typescript
// Get paginated profiles with search
async getAllProfiles(page = 1, limit = 10, search?: string) {
  const whereClause = search ? {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ]
  } : {};

  return await Profile.findAndCountAll({
    where: whereClause,
    limit,
    offset: (page - 1) * limit,
    order: [['created_at', 'DESC']]
  });
}
```

### 3. **Hybrid Authentication**
- **Sign up/in**: Supabase Auth + Sequelize profile creation
- **Token validation**: Supabase Auth
- **Profile operations**: Sequelize models

## 🔐 Security Benefits

### Row Level Security (RLS)
- Supabase RLS policies still apply
- Additional validation at ORM level
- Type-safe database operations

### Validation Layers
1. **Joi validation** (request level)
2. **Sequelize validation** (model level)
3. **Database constraints** (PostgreSQL level)

## 📊 Database Operations

### Create Profile
```typescript
const profile = await Profile.create({
  id: userId,
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user'
});
```

### Query with Relations (Future)
```typescript
const profile = await Profile.findByPk(userId, {
  include: [
    {
      model: Resume,
      as: 'resumes',
      include: [Experience, Education]
    }
  ]
});
```

### Bulk Operations
```typescript
const userStats = await Profile.findAll({
  attributes: [
    'role',
    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
  ],
  group: ['role']
});
```

## 🧪 Testing Integration

### 1. Start Development Server
```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully
✅ Database models synchronized
🚀 Server is running!
💾 Database: Connected via Sequelize
```

### 2. Test Authentication
```bash
# Sign up (creates auth user + profile)
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Response includes profile data from Sequelize
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "name": "Test User",
      "role": "user",
      "createdAt": "2023-11-01T12:00:00.000Z",
      "updatedAt": "2023-11-01T12:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

## 🚀 Advanced Features

### 1. **Model Relationships**
```typescript
// Add to Profile model
@HasMany(() => Resume)
resumes!: Resume[];

@HasMany(() => JobApplication)
applications!: JobApplication[];
```

### 2. **Database Migrations**
```bash
# Initialize Sequelize CLI
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name add-resume-table

# Run migrations
npx sequelize-cli db:migrate
```

### 3. **Query Optimization**
```typescript
// Eager loading with conditions
const profiles = await Profile.findAll({
  include: [
    {
      model: Resume,
      where: { status: 'active' },
      required: false // LEFT JOIN
    }
  ]
});
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Error**
   ```
   ❌ Unable to connect to the database
   ```
   - Verify DATABASE_URL format
   - Check Supabase database password
   - Ensure SSL configuration

2. **Model Sync Issues**
   ```
   Error: relation "profiles" does not exist
   ```
   - Run the database setup SQL first
   - Check model table name matches

3. **Authentication Mismatch**
   ```
   User profile not found
   ```
   - Ensure profile creation after auth signup
   - Check UUID consistency between auth and profiles

### Debug Mode
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 🎯 Best Practices

1. **Use Transactions** for related operations
2. **Implement proper indexes** for performance
3. **Use Sequelize hooks** for automated tasks
4. **Keep Auth and DB concerns separated**
5. **Implement proper error handling**

## 📈 Performance Tips

1. **Connection Pooling**: Already configured
2. **Query Optimization**: Use `attributes` to select specific fields
3. **Indexes**: Add for frequently queried fields
4. **Caching**: Consider Redis for frequent queries

## 🔗 Next Steps

1. **Add more models** (Resume, Experience, Education)
2. **Implement relationships** between models
3. **Add database migrations** for schema changes
4. **Create admin panels** using Sequelize queries
5. **Add full-text search** capabilities

This integration gives you the reliability of Supabase Auth with the power and flexibility of Sequelize ORM! 
# Intelli Resume API

A production-ready Express.js API with TypeScript, Supabase Authentication, and Sequelize ORM following industry best practices.

## 🚀 Features

### Core Framework
- **Express.js** with TypeScript
- **Sequelize ORM** with TypeScript decorators
- **Supabase Authentication** (JWT-based)
- **PostgreSQL** database via Supabase

### Security & Performance
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** with express-rate-limit
- **Compression** middleware
- **Input validation** with comprehensive error handling
- **Row Level Security** (RLS) via Supabase

### Development Experience
- **TypeScript** with strict configuration
- **ESLint** + **Prettier** for code quality
- **Jest** testing framework
- **Morgan** logging
- **Nodemon** for development
- **Path aliases** for clean imports

### Authentication System
- JWT token-based authentication
- User registration and login
- Password reset functionality
- Role-based access control
- Profile management via Sequelize models

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Sequelize database configuration
│   ├── supabase.ts   # Supabase client setup
│   └── index.ts      # General app configuration
├── controllers/      # Request handlers
│   └── auth.controller.ts
├── middleware/       # Custom middleware
│   └── auth.middleware.ts
├── models/          # Sequelize models
│   ├── Profile.model.ts
│   └── index.ts
├── routes/          # API routes
│   └── auth.routes.ts
├── services/        # Business logic
│   ├── auth.service.ts
│   └── profile.service.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── app.ts           # Express app setup
└── server.ts        # Server initialization
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Sequelize with PostgreSQL
- **Authentication**: Supabase Auth
- **Validation**: Built-in Sequelize validators
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Supabase project

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd intelli-resume
npm install
```

2. **Environment Configuration**
```bash
cp env.example .env
```

Update your `.env` file with:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (Sequelize)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

3. **Database Setup**
- Go to your Supabase dashboard
- Run the SQL from `docs/database-setup.sql` in the SQL editor
- This creates the profiles table and RLS policies

4. **Start Development Server**
```bash
npm run dev
```

## 🏗️ Architecture

### Hybrid Authentication + ORM Approach
```
Client → Supabase Auth → JWT Token → Express Middleware → Sequelize Models → PostgreSQL
```

**Benefits:**
- **Supabase Auth**: Handles JWT tokens, password reset, email verification
- **Sequelize ORM**: Provides type-safe models, relationships, migrations, advanced queries
- **Best of both worlds**: Auth reliability + ORM flexibility

### Authentication Flow
1. User signs up/in via Supabase Auth
2. Profile created via Sequelize model
3. JWT token returned to client
4. Subsequent requests validated via Supabase Auth
5. Database operations performed via Sequelize

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/reset-password` - Send password reset email
- `PUT /api/auth/update-password` - Update user password

### Health Check
- `GET /health` - Server health status
- `GET /api` - API information

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 📚 Documentation

- [Supabase Setup Guide](docs/supabase-setup.md) - Original Supabase integration
- [Sequelize + Supabase Integration](docs/sequelize-supabase-setup.md) - **New hybrid approach**
- [Database Setup](docs/database-setup.sql) - SQL schema

## 🔐 Security Features

### Authentication & Authorization
- JWT token validation
- Role-based access control
- Row Level Security (RLS) policies
- Secure password handling via Supabase

### Application Security
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- SQL injection prevention via Sequelize
- XSS protection

### Environment Security
- Environment variable validation
- Secure defaults for production
- Database connection encryption (SSL)

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting for production traffic
- [ ] Run database migrations

## 🔄 Database Migrations

```bash
# Initialize Sequelize CLI
npx sequelize-cli init

# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo
```

## 📈 Performance Optimization

### Database
- Connection pooling (configured)
- Query optimization with Sequelize
- Proper indexing strategy
- Pagination for large datasets

### Application
- Compression middleware
- Static file caching
- Request rate limiting
- Efficient error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Key Benefits of This Architecture:**
- 🔐 **Secure**: Supabase handles auth complexities
- 🎯 **Type-safe**: Full TypeScript support with Sequelize
- 🚀 **Scalable**: ORM relationships and advanced queries
- 🛠️ **Developer-friendly**: Models, migrations, and validation
- 📈 **Production-ready**: Comprehensive security and performance features 
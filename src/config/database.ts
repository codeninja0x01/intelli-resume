import { Sequelize } from 'sequelize-typescript';
import { config } from './index';
import { Profile } from '../models/Profile.model';

// Parse Supabase database URL
const parseSupabaseUrl = (url: string) => {
  if (!url) {
    throw new Error('Database URL is required');
  }

  try {
    const dbUrl = new URL(url);
    return {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 5432,
      database: dbUrl.pathname.substring(1), // Remove leading slash
      username: dbUrl.username,
      password: dbUrl.password,
    };
  } catch (error) {
    throw new Error('Invalid database URL format');
  }
};

// Get database configuration from Supabase URL
const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return parseSupabaseUrl(process.env.DATABASE_URL);
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
};

const dbConfig = getDbConfig();

// Create Sequelize instance
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  
  // SSL configuration for Supabase
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
  },
  
  // Model configuration
  models: [Profile],
  
  // Logging
  logging: config.nodeEnv === 'development' ? console.log : false,
  
  // Connection pool settings
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 30000,
  },
  
  // Timezone
  timezone: '+00:00',
  
  // Define options
  define: {
    timestamps: true,
    underscored: true, // Use snake_case for column names
    freezeTableName: true, // Don't pluralize table names
  },
});

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    // Skip database connection if no DATABASE_URL is provided or uses placeholder
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('your_password')) {
      console.log('⚠️  Database connection skipped - no valid DATABASE_URL provided');
      console.log('💡 Update your .env file with real Supabase credentials to enable database');
      return;
    }

    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.log('💡 Try using Supabase session pooling connection string instead of direct connection');
    
    // Don't throw in development to allow server to start
    if (config.nodeEnv === 'production') {
      throw error;
    } else {
      console.log('⚠️  Continuing in development mode without database...');
    }
  }
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

export default sequelize; 
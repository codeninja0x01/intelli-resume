import Redis from 'ioredis';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
};

// Create Redis client
export const redis = new Redis(redisConfig);

// Redis client for sessions (can use different DB if needed)
export const sessionRedis = new Redis({
  ...redisConfig,
  db: parseInt(process.env.REDIS_SESSION_DB || '1'),
});

// Redis key prefixes for organization
export const REDIS_KEYS = {
  BLACKLISTED_TOKEN: 'blacklist:token:',
  USER_SESSION: 'session:user:',
  RATE_LIMIT: 'rate:limit:',
  EMAIL_VERIFICATION: 'email:verify:',
  ACCOUNT_STATUS: 'account:status:',
} as const;

// Redis connection event handlers
redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (error: Error) => {
  console.error('Redis connection error:', error);
});

sessionRedis.on('connect', () => {
  console.log('Session Redis connected');
});

sessionRedis.on('error', (error: Error) => {
  console.error('Session Redis connection error:', error);
});

// Helper functions for common Redis operations
export const RedisHelper = {
  // Set with expiration
  async setex(key: string, seconds: number, value: string): Promise<void> {
    await redis.setex(key, seconds, value);
  },

  // Get value
  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  },

  // Delete key
  async del(key: string): Promise<number> {
    return await redis.del(key);
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  },

  // Increment counter with expiration
  async incr(key: string, expireSeconds?: number): Promise<number> {
    const count = await redis.incr(key);
    if (expireSeconds && count === 1) {
      await redis.expire(key, expireSeconds);
    }
    return count;
  },
}; 
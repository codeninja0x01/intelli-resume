// Jest setup file
import 'dotenv/config';

// Global test setup
beforeAll(() => {
  // Setup any global test configuration here
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup after tests
});

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 
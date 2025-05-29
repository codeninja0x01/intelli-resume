import 'reflect-metadata';
import app from './app';
import { config } from './config';
import { connectDatabase, closeDatabase } from './config/database';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown function
const gracefulShutdown = (signal: string) => {
  return async () => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    try {
      // Close database connection first
      await closeDatabase();
      
      server.close((err: Error | undefined) => {
        if (err) {
          console.error('Error during graceful shutdown:', err);
          process.exit(1);
        }
        
        console.log('Server closed successfully');
        process.exit(0);
      });
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
    
    // Force close server after 30 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };
};

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    const server = app.listen(config.port, config.host, () => {
      console.log(`
🚀 Server is running!
📝 Environment: ${config.nodeEnv}
🌐 URL: http://${config.host}:${config.port}
📊 Health Check: http://${config.host}:${config.port}/health
📚 API Base: http://${config.host}:${config.port}/api
💾 Database: Connected via Sequelize
⏰ Started at: ${new Date().toISOString()}
      `);
    });

    // Handle server errors
    server.on('error', (err: Error) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', gracefulShutdown('SIGTERM'));
    process.on('SIGINT', gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
let server: any;
startServer().then((serverInstance) => {
  server = serverInstance;
});

export default server; 
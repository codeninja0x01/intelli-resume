import 'reflect-metadata';
import { Server } from 'http';
import app from './app';
import { config } from './config';
import { connectDatabase, closeDatabase } from './config/database';

// ===== PROCESS EVENT HANDLERS =====

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
  console.error('🔥 Shutting down due to uncaught exception...');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection:', {
    reason: reason?.message || reason,
    promise: promise,
    timestamp: new Date().toISOString(),
  });
  console.error('🔥 Shutting down due to unhandled rejection...');
  process.exit(1);
});

// ===== SERVER MANAGEMENT =====

let server: Server | undefined;

// Graceful shutdown function
const gracefulShutdown = (signal: string) => {
  return async (): Promise<void> => {
    console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
    
    const shutdownTimeout = setTimeout(() => {
      console.error('⏰ Shutdown timeout exceeded. Forcing exit...');
      process.exit(1);
    }, 30000); // 30 second timeout

    try {
      // Stop accepting new connections
      if (server) {
        console.log('🔌 Closing HTTP server...');
        server.close(async (err?: Error) => {
          if (err) {
            console.error('❌ Error closing HTTP server:', err);
            clearTimeout(shutdownTimeout);
            process.exit(1);
          }
          
          console.log('✅ HTTP server closed');
          
          // Close database connection
          try {
            console.log('💾 Closing database connection...');
            await closeDatabase();
            console.log('✅ Database connection closed');
          } catch (dbError) {
            console.error('❌ Error closing database:', dbError);
          }
          
          console.log('🎉 Graceful shutdown completed');
          clearTimeout(shutdownTimeout);
          process.exit(0);
        });
      } else {
        // Close database if server wasn't started
        await closeDatabase();
        clearTimeout(shutdownTimeout);
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      clearTimeout(shutdownTimeout);
      process.exit(1);
    }
  };
};

// ===== SERVER STARTUP =====

const startServer = async (): Promise<Server> => {
  try {
    console.log('🚀 Starting Intelli Resume API...\n');

    // Connect to database
    console.log('💾 Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected successfully\n');

    // Start HTTP server
    console.log('🌐 Starting HTTP server...');
    server = app.listen(config.port, config.host, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🎉 SERVER STARTED SUCCESSFULLY                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 📝 Environment: ${config.nodeEnv.padEnd(58)} ║
║ 🌐 URL: http://${config.host}:${config.port}${' '.repeat(62 - (config.host + ':' + config.port.toString()).length)}║
║ 📊 Health Check: http://${config.host}:${config.port}/health${' '.repeat(46 - (config.host + ':' + config.port.toString()).length)}║
║ 📚 API Docs: http://${config.host}:${config.port}/api${' '.repeat(49 - (config.host + ':' + config.port.toString()).length)}║
║ 💾 Database: Connected via Sequelize${' '.repeat(42)}║
║ ⏰ Started: ${new Date().toISOString()}${' '.repeat(49)}║
╚══════════════════════════════════════════════════════════════════════════════╝
      `);
    });

    // Handle server errors
    server.on('error', (err: Error & { code?: string; port?: number }) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${config.port} is already in use`);
        console.error('💡 Try using a different port or kill the process using that port');
      } else if (err.code === 'EACCES') {
        console.error(`❌ Permission denied to bind to port ${config.port}`);
        console.error('💡 Try using a port number greater than 1024 or run with elevated privileges');
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

    // Register graceful shutdown handlers
    process.on('SIGTERM', gracefulShutdown('SIGTERM'));
    process.on('SIGINT', gracefulShutdown('SIGINT'));

    return server;
  } catch (error: any) {
    console.error('❌ Failed to start server:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    process.exit(1);
  }
};

// ===== APPLICATION ENTRY POINT =====

// Start the server
startServer()
  .then((serverInstance) => {
    server = serverInstance;
  })
  .catch((error) => {
    console.error('❌ Fatal error during server startup:', error);
    process.exit(1);
  });

export { server };
export default app; 
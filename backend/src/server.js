const app = require('./app');

// Determine the port
const PORT = process.env.PORT || 5000;

// Handle Uncaught Exceptions (e.g. synchronous code errors)
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running securely on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle Unhandled Promise Rejections (e.g. async errors, database connection failures)
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle gracefully shutting down on SIGTERM (sent by Docker)
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

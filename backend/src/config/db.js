const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
// We instantiate it once and export it to be used across the entire application
const prisma = new PrismaClient({
    // Optional: Log queries to the console during development
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// A simple function to test the database connection
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to the PostgreSQL database via Prisma');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    prisma,
    connectDB,
};

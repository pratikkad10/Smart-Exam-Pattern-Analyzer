import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Parse DATABASE_URL ourselves using Node's built-in URL class.
// This cleanly strips out ?schema=public (which is Prisma-only and breaks pg's parser)
// and guarantees all credentials are extracted as proper strings.
const dbUrl = new URL(process.env.DATABASE_URL);
const pool = new Pool({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // remove leading "/"
});
const adapter = new PrismaPg(pool);

// Initialize Prisma Client
// We instantiate it once and export it to be used across the entire application
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// A simple function to test the database connection
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the PostgreSQL database via Prisma');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

export {
    prisma,
    connectDB,
};

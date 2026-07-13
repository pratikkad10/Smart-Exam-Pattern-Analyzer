const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// --- Security Middlewares ---
// Set security HTTP headers (MUST be at the top to protect all routes)
app.use(helmet());

// Limit requests from same API to prevent brute-force and DDoS attacks
const limiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again in 15 minutes!'
    }
});
// Apply the rate limiter to all routes starting with /api
app.use('/api', limiter);

// --- Built-in Middlewares ---
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Health Check Route ---
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Smart Exam Pattern Analyzer API is running!'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// --- API Routes (To be imported and added here) ---
// const authRoutes = require('./routes/auth.routes');
// app.use('/api/v1/auth', authRoutes);

// --- 404 Route Handler ---
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// --- Global Error Handler ---
app.use(globalErrorHandler);

module.exports = app;

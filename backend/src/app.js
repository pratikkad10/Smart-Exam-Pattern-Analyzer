import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './middlewares/error.middleware.js';

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
app.use(cookieParser()); // Parse cookies from incoming requests
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

// --- API Routes ---
import authRoutes from './routes/auth.routes.js';
app.use('/api/v1/auth', authRoutes);

// --- 404 Route Handler ---
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// --- Global Error Handler ---
app.use(globalErrorHandler);

export default app;

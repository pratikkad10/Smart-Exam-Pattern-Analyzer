// src/middlewares/error.middleware.js

/**
 * Global Error Handling Middleware
 * Catches all errors thrown down the middleware chain.
 */
const globalErrorHandler = (err, req, res, next) => {
    // Log the error stack trace for debugging purposes
    console.error('Global Error Handler:', err.stack);
    
    // Determine the status code and status string
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';

    // Send the structured error response
    res.status(statusCode).json({
        status: status,
        message: message
    });
};

export default globalErrorHandler;

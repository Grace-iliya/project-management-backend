// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // If the error has a custom status code, use it; otherwise default to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        message: err.message || 'An unexpected server error occurred',
        // Only show the detailed stack trace in development mode so we don't leak server secrets in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { errorHandler };

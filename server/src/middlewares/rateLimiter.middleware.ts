import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for URL creation endpoint
 * Prevents abuse by limiting how many URLs can be created
 * 
 * Limits: 100 requests per 15 minutes per IP
 */
export const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many URL creation requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting for successful requests in development
    skipSuccessfulRequests: false,
    // Skip rate limiting for failed requests
    skipFailedRequests: false,
});

/**
 * Rate limiter for GET endpoints (accessing URLs)
 * More permissive since these are the main functionality
 * 
 * Limits: 60 requests per minute per IP
 */
export const getUrlLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after a minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for update/delete operations
 * Stricter limits as these are sensitive operations
 * 
 * Limits: 30 requests per 15 minutes per IP
 */
export const modifyUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many modification requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Global rate limiter for all API endpoints
 * Catches excessive requests across the entire API
 * 
 * Limits: 200 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Store rate limit data in memory (for production, use Redis)
    // store: ... // Add Redis store here for production
});

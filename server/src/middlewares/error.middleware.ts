import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/errors";

export const notFound = async (_req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    // Log error for debugging
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Check if headers were already sent
    if (res.headersSent) {
        return _next(err);
    }

    // Handle custom AppError instances
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: err.errors
        });
    }

    // Handle Mongoose cast errors (invalid ObjectId, etc.)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid data format'
        });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Resource already exists'
        });
    }

    // Handle database connection errors
    if (err.message && err.message.includes('Database connection failed')) {
        return res.status(503).json({
            status: 'error',
            message: 'Database service unavailable. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // Handle MongoDB server selection timeout
    if (err.name === 'MongoServerSelectionError' || err.message?.includes('connection')) {
        return res.status(503).json({
            status: 'error',
            message: 'Database connection failed. Please check your network connection.',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // Handle Zod validation errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: err.errors
        });
    }

    // Default to 500 server error
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal Server Error'
    });
}
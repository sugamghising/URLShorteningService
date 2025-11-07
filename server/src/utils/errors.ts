/**
 * Base custom error class for application-specific errors
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper stack trace for where our error was thrown
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * 400 Bad Request / Validation Error
 */
export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, false);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

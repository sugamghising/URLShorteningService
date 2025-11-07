export interface UrlData {
    _id: string;
    url: string;
    shortCode: string;
    accessCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUrlRequest {
    url: string;
}

export interface ApiError {
    status: 'error';
    message: string;
    errors?: Record<string, string[]>;
}

export interface RateLimitHeaders {
    limit?: string;
    remaining?: string;
    reset?: string;
}

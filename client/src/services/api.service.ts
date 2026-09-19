import { UrlData, CreateUrlRequest, ApiError } from '../types/url.types';

// Remove trailing slash from API_BASE_URL to avoid double slashes
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_ENDPOINT = `${API_BASE_URL}/api/shorten`;

class ApiService {
    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'An error occurred') as Error & ApiError;
            error.status = 'error';
            Object.assign(error, data);
            throw error;
        }

        return data;
    }

    async createShortUrl(url: string): Promise<UrlData> {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url } as CreateUrlRequest),
        });

        return this.handleResponse<UrlData>(response);
    }

    async getUrlByShortCode(shortCode: string): Promise<UrlData> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}`);
        return this.handleResponse<UrlData>(response);
    }

    async getUrlStats(shortCode: string): Promise<UrlData> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}/stats`);
        return this.handleResponse<UrlData>(response);
    }

    async updateUrl(shortCode: string, url: string, secretKey: string): Promise<UrlData> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Secret-Key': secretKey,
            },
            body: JSON.stringify({ url } as CreateUrlRequest),
        });

        return this.handleResponse<UrlData>(response);
    }

    async deleteUrl(shortCode: string, secretKey: string): Promise<void> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}`, {
            method: 'DELETE',
            headers: { 'X-Secret-Key': secretKey },
        });

        if (!response.ok) {
            let message = 'An error occurred';
            try {
                const data = await response.json();
                message = data.message || message;
                const error = new Error(message) as Error & ApiError;
                error.status = 'error';
                Object.assign(error, data);
                throw error;
            } catch (err) {
                if (err instanceof Error && (err as Error & ApiError).status === 'error') throw err;
                throw new Error(`${message} (status ${response.status})`);
            }
        }
    }
}

const apiService = new ApiService();
export default apiService;

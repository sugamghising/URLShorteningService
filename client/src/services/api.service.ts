import { UrlData, CreateUrlRequest, ApiError } from '../types/url.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

    async updateUrl(shortCode: string, url: string): Promise<UrlData> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url } as CreateUrlRequest),
        });

        return this.handleResponse<UrlData>(response);
    }

    async deleteUrl(shortCode: string): Promise<void> {
        const response = await fetch(`${API_ENDPOINT}/${shortCode}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            const error = new Error(data.message || 'An error occurred') as Error & ApiError;
            error.status = 'error';
            Object.assign(error, data);
            throw error;
        }
    }
}

const apiService = new ApiService();
export default apiService;

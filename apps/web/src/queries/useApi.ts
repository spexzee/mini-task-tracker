import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface ApiError {
    message: string;
    status?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with interceptors
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add request interceptor to include auth token
    instance.interceptors.request.use(
        (config) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    // Add response interceptor for auth errors
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Clear token and redirect to login on unauthorized
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        },
    );

    return instance;
};

// Singleton axios instance
let apiInstance: AxiosInstance | null = null;

const getApiInstance = (): AxiosInstance => {
    if (!apiInstance) {
        apiInstance = createApiInstance();
    }
    return apiInstance;
};

/**
 * Make API request to the backend server
 *
 * @param method - HTTP method
 * @param path - API path (e.g., /api/auth/login, /api/tasks)
 * @param data - Request body
 * @param params - Query parameters
 *
 * Examples:
 * useApi("POST", "/api/auth/login", { email, password })
 * useApi("GET", "/api/tasks")
 * useApi("POST", "/api/tasks", { title, description, dueDate })
 * useApi("PUT", "/api/tasks/123", { status: "completed" })
 * useApi("DELETE", "/api/tasks/123")
 */
const useApi = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: unknown,
    params?: Record<string, unknown>,
): Promise<T> => {
    try {
        const api = getApiInstance();

        const response = await api.request<T>({
            method,
            url: path,
            data,
            params,
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Check for network/CORS errors (no response)
            if (!error.response) {
                console.error('Network/CORS error:', error.message);
                throw {
                    message: 'Unable to connect to server. Please check your network connection.',
                    status: 0,
                };
            }

            const apiError: ApiError = {
                message: error.response?.data?.message || 'An error occurred',
                status: error.response?.status,
            };
            throw apiError;
        }

        throw { message: 'An error occurred', status: 500 };
    }
};

export default useApi;
export { getApiInstance, API_BASE_URL };
export type { ApiError };

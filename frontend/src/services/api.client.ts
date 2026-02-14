import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

class ApiClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request Interceptor to add Token
        this.client.interceptors.request.use(
            (config) => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('token');
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor for Errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        // Optional: Redirect to login
                        // window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth
    async login(credentials: any) {
        const { data } = await this.client.post('/auth/login', credentials);
        if (data.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('token', data.accessToken);
        }
        return data;
    }

    async signup(userData: any) {
        const { data } = await this.client.post('/auth/signup', userData);
        if (data.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('token', data.accessToken);
        }
        return data;
    }

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }

    // Products
    async getProducts(params?: any) {
        const { data } = await this.client.get('/products', { params });
        return data;
    }

    async getProduct(id: string) {
        const { data } = await this.client.get(`/products/${id}`);
        return data;
    }

    // Analysis
    async analyzeSkin(formData: FormData) {
        const { data } = await this.client.post('/analysis/scan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    // Orders
    async createOrder(orderData: any) {
        const { data } = await this.client.post('/orders', orderData);
        return data;
    }

    async getMyOrders() {
        const { data } = await this.client.get('/orders/my-orders');
        return data;
    }
}

export const apiClient = new ApiClient();

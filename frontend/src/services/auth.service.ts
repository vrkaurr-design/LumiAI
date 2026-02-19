import apiClient from '@/lib/api-client';

export const authService = {
  async signup(email: string, password: string, name?: string) {
    const { data } = await apiClient.post('/auth/signup', { email, password, name });
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async getProfile() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

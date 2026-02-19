import apiClient from '@/lib/api-client';

export const productsService = {
  async getProducts(params?: any) {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  async getProduct(id: string) {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  async getFeatured() {
    const { data } = await apiClient.get('/products/featured');
    return data;
  },
};

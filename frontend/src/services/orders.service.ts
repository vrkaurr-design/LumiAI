import apiClient from '@/lib/api-client';

export const ordersService = {
  async createOrder(orderData: any) {
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },

  async getOrders() {
    const { data } = await apiClient.get('/orders');
    return data;
  },

  async getOrder(id: string) {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
  },
};

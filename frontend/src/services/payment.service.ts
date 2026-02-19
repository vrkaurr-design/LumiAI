import apiClient from '@/lib/api-client';

export const paymentService = {
  async createPaymentIntent(orderId: string, amount: number) {
    const { data } = await apiClient.post('/payment/create-intent', { orderId, amount });
    return data;
  },

  async confirmPayment(paymentIntentId: string, orderId: string) {
    const { data } = await apiClient.post('/payment/confirm', { paymentIntentId, orderId });
    return data;
  },
};

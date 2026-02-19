import apiClient from '@/lib/api-client';

export const analysisService = {
  async analyzeSkin(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const { data } = await apiClient.post('/analysis/skin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async getHistory() {
    const { data } = await apiClient.get('/analysis/history');
    return data;
  },
};

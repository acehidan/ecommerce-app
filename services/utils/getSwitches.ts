import api from '../api';

export const getSwitches = async () => {
  try {
    const response = await api.get('/api/v1/switches');
    return response.data;
  } catch (error) {
    console.error('Error fetching switches:', error);
    throw error;
  }
};

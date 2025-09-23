import api from '../api';

const handleGetNewArrivalsProducts = async () => {
  try {
    const response = await api.get('/api/v1/stocks');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to get new arrivals products',
    };
  }
};

export default handleGetNewArrivalsProducts;

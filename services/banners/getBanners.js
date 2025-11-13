import api from '../api';

const handleGetBanners = async () => {
  try {
    const response = await api.get('/api/v1/banners');
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
        'Failed to get banners',
    };
  }
};

export default handleGetBanners;


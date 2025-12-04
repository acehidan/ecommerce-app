import api from '../api';

const handleGetBannerById = async (bannerId) => {
  try {
    const response = await api.get(`/api/v1/banners/${bannerId}`);
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
        'Failed to get banner',
    };
  }
};

export default handleGetBannerById;


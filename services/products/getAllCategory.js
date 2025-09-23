import api from '../api';

const handleGetAllCategory = async () => {
  try {
    const response = await api.get('/api/v1/stocks/overviews');
    console.log('response', response);
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
        'Failed to get all category',
    };
  }
};

export default handleGetAllCategory;

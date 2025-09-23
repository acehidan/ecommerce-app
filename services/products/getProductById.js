import api from '../api';

const handleGetProductById = async (id) => {
  try {
    const response = await api.get(`/api/v1/stocks/${id}`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default handleGetProductById;

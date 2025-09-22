import api from '../api';

const handleGetByCategory = async (category) => {
  try {
    const response = await api.get(
      `/api/v1/stocks/categories?category=${category}`
    );
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

export default handleGetByCategory;

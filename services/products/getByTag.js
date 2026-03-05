import api from '../api';

const handleGetByTag = async (tag) => {
  try {
    const url = tag === 'discount'
      ? '/api/v1/stocks?isDiscounted=true'
      : `/api/v1/stocks?tags=${tag}`;
    const response = await api.get(url);
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

export default handleGetByTag;

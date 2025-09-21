import api from '../api';

const handleLogin = async (data: { phoneNumber: string; password: string }) => {
  try {
    const response = await api.post('/api/v1/login', data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Login failed',
    };
  }
};

export default handleLogin;

import api from '../api';
import { saveUserProfile } from '../user/userProfile';

const handleLogin = async (data: { phoneNumber: string; password: string }) => {
  try {
    const response = await api.post('/api/v1/login', data);

    if (response.data.token && response.data.user) {
      await saveUserProfile({
        token: response.data.token,
        user: response.data.user,
      });
    }

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

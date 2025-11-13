import api from '../api';
import { saveUserProfile } from '../user/userProfile';

const handleSignUp = async (data: {
  userName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await api.post('/api/v1/signup', data);

    // Handle new response structure: { success, message, data: { token, user } }
    const token = response.data?.data?.token || response.data?.token;
    const user = response.data?.data?.user || response.data?.user;

    if (token && user) {
      await saveUserProfile({
        token,
        user,
      });
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Signup failed',
    };
  }
};

export default handleSignUp;

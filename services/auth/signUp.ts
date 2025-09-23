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
      error: error.response?.data?.message || error.message || 'Signup failed',
    };
  }
};

export default handleSignUp;

import api from '../api';

const handleForgotPassword = async (data: { phoneNumber: string }) => {
  try {
    const response = await api.post('/api/v1/forgot-password', data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to send reset OTP',
    };
  }
};

export default handleForgotPassword;

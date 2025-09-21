import api from '../api';

const handleResetPassword = async (data: {
  phoneNumber: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await api.post('/api/v1/reset-password', data);
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
        'Failed to reset password',
    };
  }
};

export default handleResetPassword;

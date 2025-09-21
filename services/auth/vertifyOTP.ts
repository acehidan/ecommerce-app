import api from '../api';

const handleVerifyOTP = async (data: {
  phoneNumber: string;
  otpCode: string;
}) => {
  try {
    const response = await api.post('/api/v1/verify-otp', data);
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
        'OTP verification failed',
    };
  }
};

export default handleVerifyOTP;

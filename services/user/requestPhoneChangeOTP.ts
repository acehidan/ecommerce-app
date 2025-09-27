import { api } from '../api';

export interface RequestPhoneChangeOTPRequest {
  newPhoneNumber: string;
}

export interface RequestPhoneChangeOTPResponse {
  success: boolean;
  message: string;
  data?: {
    otpId: string;
    expiresAt: string;
  };
}

export const requestPhoneChangeOTP = async (
  newPhoneNumber: string
): Promise<RequestPhoneChangeOTPResponse> => {
  try {
    const response = await api.post('/api/v1/request-phone-change-otp', {
      newPhoneNumber,
    });

    return response.data;
  } catch (error) {
    console.error('Error requesting phone change OTP:', error);
    throw error;
  }
};

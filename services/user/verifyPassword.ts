import api from '../api';

export interface VerifyPasswordRequest {
  phoneNumber: string;
  oldPassword: string;
}

export interface VerifyPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
  };
}

export const verifyPassword = async (
  phoneNumber: string,
  oldPassword: string
): Promise<VerifyPasswordResponse> => {
  try {
    const response = await api.post('/api/v1/confirm-old-password', {
      phoneNumber,
      oldPassword,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

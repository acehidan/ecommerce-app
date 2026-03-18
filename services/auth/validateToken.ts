import api from '../api';

export interface ValidateTokenResponse {
  status: string;
  message: string;
  valid: boolean;
  data?: {
    userId: string;
    role: string;
    issuedAt: string;
    expiresAt: string;
    isExpired: boolean;
    timeUntilExpiry: number;
    user: {
      id: string;
      role: string;
      isActive: boolean;
    };
  };
}

export const validateToken = async (): Promise<ValidateTokenResponse> => {
  try {
    const response = await api.post('/api/v1/admin/validate');
    console.log('validateToken', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

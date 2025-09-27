import api from '../api';

export interface UpdatePasswordRequest {
  passwordChangeToken: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export const updatePassword = async (
  passwordChangeToken: string,
  newPassword: string
): Promise<UpdatePasswordResponse> => {
  try {
    const response = await api.post('/api/v1/update-password', {
      passwordChangeToken,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

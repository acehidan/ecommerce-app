import Toast from 'react-native-toast-message';
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
    if (response.data.success) {
      Toast.show({
        type: 'success',
        text2:
          response.data.message || 'လျှို့ဝှက်နံပါတ် အတည်ပြုခြင်း အောင်မြင်ပါပြီ',

      });
    }
    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text2:
        error.response.data.message || 'လျှို့ဝှက်နံပါတ် အတည်ပြုခြင်း မအောင်မြင်ပါ',

    });
    throw error;
  }
};

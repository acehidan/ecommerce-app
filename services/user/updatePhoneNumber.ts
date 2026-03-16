import api from '../api';
import { updateUserProfile } from './userProfile';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';

export interface UpdatePhoneNumberRequest {
  newPhoneNumber: string;
}

export interface UpdatePhoneNumberResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      userName: string;
      phoneNumber: string;
      role: string;
      isVerified: boolean;
      updatedAt: string;
    };
  };
}

export const updatePhoneNumber = async (
  newPhoneNumber: string
): Promise<UpdatePhoneNumberResponse> => {
  try {
    const response = await api.patch('/api/v1/phone-number-change', {
      newPhoneNumber,
    });

    // Update local storage and store if API call is successful
    if (response.data.success && response.data.data?.user) {
      const updatedUser = response.data.data.user;

      // Update user profile with full user object to ensure all fields are saved
      await updateUserProfile({
        _id: updatedUser._id,
        userName: updatedUser.userName,
        phoneNumber: updatedUser.phoneNumber,
        isVerified: updatedUser.isVerified,
        role: updatedUser.role,
      });

      // Update the auth store (this will also trigger persist middleware)
      useAuthStore.getState().updatePhoneNumber(
        updatedUser.phoneNumber,
        updatedUser.isVerified
      );
      Toast.show({
        type: 'success',
        text2: response.data.message || 'ဖုန်းနံပါတ် ပြောင်းလဲပြီးပါပြီ',
      });
    }

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'info',
      text2: error.response.data.message || 'ဖုန်းနံပါတ် ပြောင်းလဲမှု မအောင်မြင်ပါ',
    })
    console.error('Error updating phone number:', error);
    throw error;
  }
};


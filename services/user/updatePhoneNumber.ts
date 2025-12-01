import api from '../api';
import { updateUserProfile } from './userProfile';
import { useAuthStore } from '../../store/authStore';

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
      await updateUserProfile({
        phoneNumber: response.data.data.user.phoneNumber,
        isVerified: response.data.data.user.isVerified,
      });

      // Update the auth store
      useAuthStore.getState().updatePhoneNumber(
        response.data.data.user.phoneNumber,
        response.data.data.user.isVerified
      );
    }

    return response.data;
  } catch (error) {
    console.error('Error updating phone number:', error);
    throw error;
  }
};


import api from '../api';
import { updateUserProfile } from './userProfile';
import { useAuthStore } from '../../store/authStore';

export interface UpdateUsernameRequest {
  userName: string;
}

export interface UpdateUsernameResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      userName: string;
    };
  };
}

export const updateUsername = async (
  userName: string
): Promise<UpdateUsernameResponse> => {
  try {
    const response = await api.patch('/api/v1/username-change', {
      userName,
    });

    // Update local storage and store if API call is successful
    if (response.data.success && response.data.data?.user) {
      await updateUserProfile({
        userName: response.data.data.user.userName,
      });

      // Update the auth store
      useAuthStore.getState().updateUsername(response.data.data.user.userName);
    }

    return response.data;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
};

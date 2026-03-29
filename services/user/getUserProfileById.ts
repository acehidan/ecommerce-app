import api from '../api';

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      userName: string;
      phoneNumber: string;
      isVerified: boolean;
      role: string;
      isBanned: boolean;
      lastActiveAt: string | null;
      updatedAt: string;
      createdAt: string;
      __v: number;
    };
    userAddressInfo: Array<{
      _id: string;
      userId: string;
      note: string;
      address: string;
      city: string;
      township: string;
      __v: number;
    }>;
  };
}

export const getUserProfileById = async (userId: string): Promise<UserProfileResponse> => {
  try {
    const response = await api.get(`/api/v1/user-profile/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

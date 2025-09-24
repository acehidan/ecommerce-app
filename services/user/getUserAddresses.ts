import api from '../api';

export interface UserAddress {
  _id: string;
  userId: string;
  note: string;
  address: string;
  city: string;
  township: string;
  __v: number;
}

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
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    userAddressInfo: UserAddress[];
  };
}

export const getUserAddresses = async (
  userId: string
): Promise<UserProfileResponse> => {
  try {
    const response = await api.get(`/api/v1/user-profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

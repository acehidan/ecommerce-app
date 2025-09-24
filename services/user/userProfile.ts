import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  _id: string;
  userName: string;
  phoneNumber: string;
  isVerified: boolean;
  role: string;
}

export interface UserProfile {
  token: string;
  user: User;
}

const USER_PROFILE_KEY = 'userProfile';
const AUTH_TOKEN_KEY = 'authToken';

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    // Validate profile data
    if (!profile) {
      throw new Error('Profile data is required');
    }

    if (!profile.token || profile.token.trim() === '') {
      throw new Error('Token is required and cannot be empty');
    }

    if (!profile.user) {
      throw new Error('User data is required');
    }

    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, profile.token);
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const clearUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  updates: Partial<User>
): Promise<void> => {
  try {
    const profile = await getUserProfile();
    if (profile) {
      const updatedProfile = {
        ...profile,
        user: { ...profile.user, ...updates },
      };
      await saveUserProfile(updatedProfile);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

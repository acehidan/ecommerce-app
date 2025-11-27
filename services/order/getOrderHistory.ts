import api from '../api';
import { getAuthToken } from '../user/userProfile';

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    orders: Order[];
  };
}

export interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  platform: string;
  paymentMethod: string;
  createdAt: string;
}

export const getOrderHistory = async (): Promise<OrderHistoryResponse> => {
  try {
    // Check if token exists before making the request
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    const response = await api.get('/api/v1/user/orders');
    console.log('Order history response:', response.data);

    // Handle different response structures
    if (response.data.success !== undefined) {
      return response.data;
    }

    // If response doesn't have success field, wrap it
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error('Error fetching order history:', error);

    // Handle 401 specifically
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    // Handle other errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.message) {
      throw error;
    }

    throw new Error('Failed to fetch order history');
  }
};

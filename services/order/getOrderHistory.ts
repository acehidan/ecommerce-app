import api from '../api';

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
    const response = await api.get('/api/v1/user/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

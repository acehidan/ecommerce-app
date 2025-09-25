import api from '../api';

export interface CreateOrderRequest {
  userId: string;
  products: Array<{
    stockId: string;
    quantity: number;
  }>;
  address: string;
  deliveryZone: string;
  platform: string;
  paymentMethod: string;
}

export interface OrderProduct {
  stockId: string;
  quantity: number;
  name: string;
  productCode: string;
  unitPrice: number;
  unitWeight: number;
  weightUnit: string;
  sale: string;
}

export interface DeliveryInfo {
  city: string;
  township: string;
  totalWeight: number;
  deliveryFee: number;
  baseDeliveryFee: number;
  additionalWeightCharge: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    status: string;
    totalAmount: number;
    delivery: DeliveryInfo;
    products: OrderProduct[];
    address: string;
  };
}

export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post('/api/v1/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

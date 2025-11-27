import api from '../api';

export interface Delivery {
  _id: string;
  city: string;
  township: string;
  deliveryFee: number;
  additionalWeightCharge: number;
  reachable: boolean;
  updatedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  __v: number;
}

export interface GetDeliveriesResponse {
  status: string;
  message: string;
  count: number;
  data: Delivery[];
}

export const getDeliveries = async (): Promise<GetDeliveriesResponse> => {
  try {
    const response = await api.get('/api/v1/delivery');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching deliveries:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch delivery information'
    );
  }
};

export default getDeliveries;


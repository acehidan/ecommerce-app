import api from '../api';

export interface GetDeliveryZoneResponse {
  success: boolean;
  message: string;
  data: {
    deliveryZone: string;
  };
}

export const getDeliveryZone = async (
  city: string,
  township: string
): Promise<GetDeliveryZoneResponse> => {
  try {
    const response = await api.get('/api/v1/delivery/matcher', {
      params: {
        city,
        township,
      },
    });

    console.log('Delivery zone API response:', JSON.stringify(response.data, null, 2));

    // Handle different possible response structures
    const deliveryZone =
      response.data?.data?.deliveryZone ||
      response.data?.data?._id ||
      response.data?.deliveryZone ||
      response.data?._id ||
      '';

    console.log('Extracted delivery zone:', deliveryZone);

    if (!deliveryZone) {
      console.warn('No delivery zone found in response:', response.data);
    }

    return {
      success: true,
      message: response.data.message || 'Delivery zone retrieved successfully.',
      data: {
        deliveryZone,
      },
    };
  } catch (error: any) {
    console.error('Error fetching delivery zone:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch delivery zone',
      data: {
        deliveryZone: '',
      },
    };
  }
};


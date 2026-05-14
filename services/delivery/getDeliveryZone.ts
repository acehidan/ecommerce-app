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
  township: string,
): Promise<GetDeliveryZoneResponse> => {
  try {
    const response = await api.get('/api/v1/delivery/matcher', {
      params: {
        city,
        township,
      },
    });
    // console.log("Delivery matcher API response status:", response.data.status || response.data.success);

    // console.log('Delivery zone API response:', JSON.stringify(response.data, null, 2));

    // Handle different possible response structures
    const deliveryZone =
      response.data?.data?.deliveryZone ||
      response.data?.data?._id ||
      response.data?.deliveryZone ||
      response.data?._id ||
      '';

    // Handle inconsistent backend response (some use 'status', some use 'success')
    const isSuccessful =
      response.data.status === 'success' ||
      response.data.success === true ||
      (response.data.status === undefined &&
        response.data.success === undefined &&
        deliveryZone);

    if (!deliveryZone || !isSuccessful) {
      console.warn('No delivery zone found or API failed:', response.data);
      return {
        success: false,
        message: response.data.message || 'ပို့ဆောင်ရေး နယ်မြေ ရှာမတွေ့ပါ။',
        data: {
          deliveryZone: '',
        },
      };
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

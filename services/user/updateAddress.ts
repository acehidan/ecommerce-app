import api from '../api';

export interface UpdateAddressRequest {
  note: string;
  address: string;
  city: string;
  township: string;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    note: string;
    address: string;
    city: string;
    township: string;
    __v: number;
  };
}

const updateAddress = async (
  addressId: string,
  addressData: UpdateAddressRequest
): Promise<UpdateAddressResponse> => {
  try {
    const response = await api.patch(
      `/api/v1/addresses/${addressId}`,
      addressData
    );

    return {
      success: true,
      message: response.data.message || 'Address updated successfully.',
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error updating address:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to update address',
      data: {
        _id: '',
        userId: '',
        note: '',
        address: '',
        city: '',
        township: '',
        __v: 0,
      },
    };
  }
};

export default updateAddress;


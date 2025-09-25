import api from '../api';

export interface AddAddressRequest {
  userId: string;
  note: string;
  address: string;
  city: string;
  township: string;
}

export interface AddAddressResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    note: string;
    address: string;
    city: string;
    township: string;
    _id: string;
    __v: number;
  };
}

const addAddress = async (
  addressData: AddAddressRequest
): Promise<AddAddressResponse> => {
  try {
    const response = await api.post('/api/v1/addresses', addressData);

    return {
      success: true,
      message: response.data.message || 'Address created successfully.',
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error adding address:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to add address',
      data: {
        userId: '',
        note: '',
        address: '',
        city: '',
        township: '',
        _id: '',
        __v: 0,
      },
    };
  }
};

export default addAddress;

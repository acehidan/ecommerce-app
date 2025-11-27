import api from '../api';

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
}

const deleteAddress = async (
  addressId: string
): Promise<DeleteAddressResponse> => {
  try {
    const response = await api.delete(`/api/v1/addresses/${addressId}`);

    return {
      success: true,
      message: response.data.message || 'Address deleted successfully.',
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to delete address',
      data: {
        _id: '',
      },
    };
  }
};

export default deleteAddress;


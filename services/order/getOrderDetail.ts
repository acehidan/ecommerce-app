import api from '../api';
import { getAuthToken } from '../user/userProfile';

export interface OrderDetailResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        userId: {
            _id: string;
            userName: string;
            phoneNumber: string;
        };
        products: Array<{
            stockId: string;
            quantity: number;
            name: string;
            category: string;
            productCode: string;
            unitPrice: number;
            unitWeight: number;
            weightUnit: string;
            sale: string;
        }>;
        address: string;
        delivery: {
            deliveryZoneId: string;
            city: string;
            township: string;
            baseDeliveryFee: number;
            additionalWeightCharge: number;
            totalWeight: number;
            calculatedDeliveryFee: number;
        };
        subTotal: number | null;
        tax: number;
        discount: number;
        finalAmount: number;
        paidAmount: number;
        status: string;
        platform: string;
        paymentMethod: string;
        updatedAt: string;
        deletedAt: string | null;
        kbz_prepay_id?: string | null;
        kbz_mm_order_id?: string | null;
        kbz_trade_status?: string | null;
        kbz_notify_time?: string | null;
        kbz_trans_end_time?: string | null;
        createdAt: string;
        __v: number;
    };
}

export const getOrderDetail = async (
    orderId: string,
): Promise<OrderDetailResponse> => {
    try {
        // Check if token exists before making the request
        const token = await getAuthToken();
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }

        const response = await api.get(`/api/v1/order/${orderId}`);
        console.log('Order detail response:', response.data);

        // Handle different response structures
        if (response.data.success !== undefined) {
            return response.data;
        }

        // If response doesn't have success field, wrap it
        return {
            success: true,
            message: 'Order retrieved successfully',
            data: response.data.data || response.data,
        };
    } catch (error: any) {
        console.error('Error fetching order detail:', error);

        // Handle 401 specifically
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please login again.');
        }

        // Handle 404 specifically
        if (error.response?.status === 404) {
            throw new Error('Order not found.');
        }

        // Handle other errors
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }

        if (error.message) {
            throw error;
        }

        throw new Error('Failed to fetch order detail');
    }
};
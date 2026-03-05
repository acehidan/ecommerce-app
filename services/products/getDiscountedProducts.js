import api from '../api';

const handleGetDiscountedProducts = async () => {
    try {
        const response = await api.get('/api/v1/stocks', {
            params: { isDiscounted: true },
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                'Failed to get discounted products',
        };
    }
};

export default handleGetDiscountedProducts;

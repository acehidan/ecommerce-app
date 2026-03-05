import api from '../api';

const handleGetProductsByTag = async (tag) => {
    try {
        const response = await api.get('/api/v1/stocks', {
            params: { tags: tag },
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
                `Failed to get products for tag: ${tag}`,
        };
    }
};

export default handleGetProductsByTag;

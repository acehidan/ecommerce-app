import api from '../api';

const handleGetTags = async () => {
    try {
        const response = await api.get('/api/v1/stocks/tags');
        return {
            success: true,
            data: response.data?.data || [],
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                'Failed to get tags',
        };
    }
};

export default handleGetTags;

import api from '../api';

export const getMessages = async (page = 1, limit = 20) => {
  try {
    const url = `/api/v1/messages?page=${page}&limit=${limit}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a message via HTTP POST.
 * The backend handles conversationId internally.
 */
export const sendMessage = async (message: string) => {
  try {
    const response = await api.post('/api/v1/chat/message', {
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

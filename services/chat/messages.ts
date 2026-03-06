import api from '../api';

export const getMessages = async (conversationId?: string) => {
  try {
    const url = conversationId
      ? `/api/v1/messages?conversationId=${conversationId}`
      : '/api/v1/messages';
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

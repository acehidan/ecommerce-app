import api from '../api';

export const getMessages = async () => {
  try {
    const response = await api.get('/api/v1/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (message) => {
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

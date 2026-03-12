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
 * message can be a string (text) or FormData (image).
 */
export const sendMessage = async (message: string | FormData) => {
  try {
    let data;
    let headers = {};

    if (message instanceof FormData) {
      data = message;
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      data = { message };
    }

    const response = await api.post('/api/v1/chat/message', data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

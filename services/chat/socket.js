import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'https://api.komindiystore.com';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            transports: ['websocket'],
        });
    }
    return socket;
};

export const connectSocket = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const sock = getSocket();

    if (token) {
        sock.auth = { token };
    }

    if (!sock.connected) {
        sock.connect();
    }

    return sock;
};

export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect();
    }
};

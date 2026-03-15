import { io } from 'socket.io-client';
import { getBaseURL } from '../api/discovery';

const URL = getBaseURL();

export const socket = io(URL, {
    extraHeaders: {
        'bypass-tunnel-reminder': 'true'
    },
    // Garante que o socket tente reconectar se o servidor cair/voltar
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

// Helper para re-inicializar caso o usuário mude o URL manualmente no assistente
export const reconnectSocket = (newUrl) => {
    if (socket.connected) {
        socket.disconnect();
    }
    socket.io.uri = newUrl;
    socket.connect();
};

export default socket;

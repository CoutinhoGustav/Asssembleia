import { io } from 'socket.io-client';
import { getDiscoveryURL } from '../api';

const url = getDiscoveryURL();

export const socket = io(url, {
    extraHeaders: {
        'Bypass-Tunnel-Reminder': 'true'
    },
    query: {
        'bypass-tunnel-reminder': 'true'
    },
    transports: ['polling', 'websocket'],
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});

// Listener de debug para ajudar a identificar falhas de conexão no celular
socket.on('connect_error', (err) => {
    console.error('[Socket] Erro de conexão:', err.message);
    console.log('[Socket] Tentando conectar em:', url);
});

socket.on('connect', () => {
    console.log('[Socket] Conectado com sucesso em:', url);
});

export default socket;

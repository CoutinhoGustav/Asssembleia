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

export default socket;

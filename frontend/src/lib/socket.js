import { io } from 'socket.io-client';
import { getDiscoveryURL } from '../api';

export const socket = io(getDiscoveryURL(), {
    extraHeaders: {
        'Bypass-Tunnel-Reminder': 'true'
    },
    transports: ['polling', 'websocket'],
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});

export default socket;

import { io } from 'socket.io-client';

const getDiscoveryURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    url = url.trim().replace(/\/$/, "");

    // Auto-fix protocol para LocalTunnel no Vercel/HTTPS
    if (window.location.protocol === 'https:' && url.includes('localtunnel.me') && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
    }
    return url;
};

export const socket = io(getDiscoveryURL(), {
    extraHeaders: {
        'bypass-tunnel-reminder': 'true'
    },
    transports: ['polling', 'websocket'], // Essencial para estabilidade no Vercel/Túneis
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});

export default socket;

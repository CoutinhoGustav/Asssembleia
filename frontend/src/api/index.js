import axios from 'axios';

export const getDiscoveryURL = () => {
    console.log('[Discovery] Iniciando descoberta de URL...');
    // Busca a URL da variável de ambiente definida no Vercel/Build
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    url = url.trim().replace(/\/$/, "");

    console.log('[Discovery] URL base inicial:', url);

    // Se estivermos em HTTPS (Vercel) e o backend for LocalTunnel, forçamos HTTPS
    if (window.location.protocol === 'https:' && url.includes('localtunnel.me')) {
        url = url.replace('http://', 'https://');
        console.log('[Discovery] Protocolo forçado para HTTPS');
    }
    
    console.log('[Discovery] URL Final:', url);
    return url;
};

const api = axios.create({
    baseURL: getDiscoveryURL(),
    headers: {
        'Bypass-Tunnel-Reminder': 'true'
    }
});

console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    if (config.url && (config.url.includes('localtunnel.me') || api.defaults.baseURL.includes('localtunnel.me'))) {
        config.params = { ...config.params, 'bypass-tunnel-reminder': 'true' };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response && error.code !== 'ECONNABORTED') {
            console.error('Possível bloqueio de Túnel ou Servidor offline');
        }

        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

export const getDiscoveryURL = () => {
    console.log('[Discovery] Iniciando descoberta de URL...');
    
    // 1. Pega a URL base (Vercel env ou localhost padrão)
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    url = url.trim().replace(/\/$/, "");

    const currentHost = window.location.hostname;
    const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.)/.test(currentHost) || currentHost.includes('.local');

    // 2. Se estivermos acessando por um IP local (WiFi) e a URL padrão for localhost, 
    // trocamos localhost pelo IP real do computador na rede.
    // Isso permite que o celular ache o computador sem configuração manual.
    if (isLocalIP && url.includes('localhost')) {
        console.log(`[Discovery] Detectado acesso por IP local (${currentHost}). Ajustando backend...`);
        url = url.replace('localhost', currentHost);
    }

    // 3. Se estivermos em HTTPS (Vercel) e o backend for LocalTunnel, forçamos HTTPS
    if (window.location.protocol === 'https:' && url.includes('localtunnel.me')) {
        url = url.replace('http://', 'https://');
        console.log('[Discovery] Protocolo tunnel forçado para HTTPS para evitar Mixed Content');
    }
    
    console.log('[Discovery] URL Final do Backend:', url);
    return url;
};

const api = axios.create({
    baseURL: getDiscoveryURL(),
    headers: {
        'Bypass-Tunnel-Reminder': 'true'
    }
});

console.log('API Base URL configurada:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    // Bypass robusto para LocalTunnel (Headers + Query Param)
    if (config.url && (config.url.includes('localtunnel.me') || api.defaults.baseURL.includes('localtunnel.me'))) {
        config.params = { ...config.params, 'bypass-tunnel-reminder': 'true' };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response && error.code !== 'ECONNABORTED') {
            console.error('[API] Erro de rede: Possível bloqueio de Túnel, Servidor offline ou IP inacessível.');
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

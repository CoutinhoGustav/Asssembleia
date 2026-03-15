import axios from 'axios';

export export const getDiscoveryURL = () => {
    // Busca a URL da variável de ambiente definida no Vercel/Build
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    url = url.trim().replace(/\/$/, "");

    // Se estivermos em HTTPS (Vercel) e o backend for LocalTunnel, forçamos HTTPS
    // Isso é CRÍTICO para o celular não bloquear a conexão por segurança (Mixed Content)
    if (window.location.protocol === 'https:' && url.includes('localtunnel.me')) {
        url = url.replace('http://', 'https://');
    }
    
    console.log('[Discovery] Backend URL calculada:', url);
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

    // Adiciona o parâmetro de query para burlar o LocalTunnel de forma mais robusta
    // Funciona melhor que headers em alguns navegadores móveis (Safari/Chrome Mobile)
    if (config.url && (config.url.includes('localtunnel.me') || api.defaults.baseURL.includes('localtunnel.me'))) {
        config.params = { ...config.params, 'bypass-tunnel-reminder': 'true' };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se for um erro de rede (possivelmente o LocalTunnel bloqueando ou desligado)
        if (!error.response && error.code !== 'ECONNABORTED') {
            console.error('Possível bloqueio de Túnel ou Servidor offline');
            
            // Se estivermos no celular, podemos sugerir ao usuário abrir o link uma vez
            // Mas o objetivo é ser automático, então vamos apenas logar por enquanto
            // e tentar uma estratégia de retry ou aviso mais amigável no UI se necessário.
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

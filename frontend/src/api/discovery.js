export const getBaseURL = () => {
    // 1. Prioridade para override manual via local storage
    const override = localStorage.getItem('VITE_API_URL');
    if (override) {
        return cleanURL(override);
    }

    // 2. Fallback para variável de ambiente fixada na build (Vercel ENV)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        return cleanURL(envUrl);
    }

    // 3. Fallback padrão para desenvolvimento local
    return 'http://localhost:3002';
};

const cleanURL = (url) => {
    let clean = url.trim();
    
    // Remove barras no final
    if (clean.endsWith('/')) {
        clean = clean.slice(0, -1);
    }

    // Auto-fix para HTTPS se estiver no Vercel (ou qualquer site HTTPS) e for LocalTunnel
    // Isso evita erro de "Mixed Content" que bloqueia o login no celular
    if (window.location.protocol === 'https:' && clean.includes('localtunnel.me') && clean.startsWith('http:')) {
        clean = clean.replace('http:', 'https:');
    }

    return clean;
};

export const saveBackendURL = (url) => {
    if (!url) return;
    localStorage.setItem('VITE_API_URL', cleanURL(url));
};

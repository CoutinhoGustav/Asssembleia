// Arquivo de configuração para desenvolvimento/produção
// Copie e renomeie este arquivo para .env.local para usar variáveis de ambiente

export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  
  // Mock
  useMock: import.meta.env.VITE_USE_MOCK !== 'false', // true por padrão
  
  // Autenticação
  tokenKey: 'token',
  userKey: 'user',
};

export default config;

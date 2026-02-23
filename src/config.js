// Arquivo de configuração para desenvolvimento/produção
// Copie e renomeie este arquivo para .env.local para usar variáveis de ambiente

export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Mock
  useMock: import.meta.env.VITE_USE_MOCK !== 'false', // true por padrão
  
  // Autenticação
  tokenKey: 'authToken',
  userKey: 'user',
};

export default config;

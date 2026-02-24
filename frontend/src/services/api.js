import axios from 'axios';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true; // true por padrão para testes

// Criar instância do axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de resposta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper para usar mock ou API real
export const request = async (config) => {
  if (USE_MOCK) {
    return mockRequest(config);
  }
  return apiClient(config);
};

// Mock de resposta
const mockRequest = async (config) => {
  const delay = 500; // Simular latência da rede
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponses[config.method?.toUpperCase() || 'GET']?.[config.url] || { data: {} });
    }, delay);
  });
};

// Respostas mockadas
const mockResponses = {
  GET: {
    '/developers': {
      data: [
        {
          id: 'dev_1',
          name: 'João Silva',
          email: 'joao@example.com',
          dateOfBirth: '1990-05-15',
        },
        {
          id: 'dev_2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          dateOfBirth: '1992-08-22',
        },
      ],
    },
    '/users': {
      data: [
        {
          id: 'user_1',
          name: 'Admin IBRC',
          email: 'admin@ibrc.com.br',
          role: 'admin',
        },
      ],
    },
  },
  POST: {
    '/developers': { data: { id: 'dev_3', name: 'Novo Dev', email: 'novo@example.com' } },
    '/auth/login': {
      data: {
        token: 'mock_token_12345',
        user: {
          id: 'user_1',
          name: 'Admin IBRC',
          email: 'admin@ibrc.com.br',
          avatar: 'https://ui-avatars.com/api/?name=Admin+IBRC',
        },
      },
    },
  },
};

export default apiClient;

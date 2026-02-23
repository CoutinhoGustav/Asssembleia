# 📡 Documentação de Integração com API NestJS

## Visão Geral

Este projeto está configurado para integração com uma API NestJS. Para facilitar o desenvolvimento, implementamos um **sistema de mock** que permite testes sem necessidade do backend rodando.

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Mock API (true = usa mock, false = usa API real)
VITE_USE_MOCK=true
```

### Alternância entre Mock e API Real

- **Para Desenvolvimento/Testes**: `VITE_USE_MOCK=true` (padrão)
- **Para Produção**: `VITE_USE_MOCK=false` + `VITE_API_URL=http://seu-backend.com`

## 📁 Estrutura de Serviços

```
src/
├── services/
│   ├── api.js                 # Configuração do axios e mock
│   ├── authService.js         # Autenticação
│   ├── developerService.js    # CRUD de Desenvolvedores
│   ├── alunoService.js        # CRUD de Alunos
│   └── turmaService.js        # CRUD de Turmas
├── context/
│   ├── AuthContext.jsx        # Contexto de Autenticação (integrado com API)
│   └── DataContext.jsx        # Contexto de Dados (integrado com API)
└── config.js                  # Configurações globais
```

## 🔌 Usando os Serviços

### Autenticação

```jsx
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login, user, loading, error } = useAuth();

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      console.log('Usuário logado:', user);
    }
  };

  return (
    // Componente de login
  );
}
```

### Developer Service

```jsx
import developerService from '../services/developerService';

// Listar todos os desenvolvedores
const developers = await developerService.findAll();

// Buscar um desenvolvedor por ID
const developer = await developerService.findOne('dev_1');

// Criar novo desenvolvedor
const newDev = await developerService.create({
  name: 'João Silva',
  email: 'joao@example.com',
  dateOfBirth: '1990-05-15'
});

// Atualizar desenvolvedor
const updated = await developerService.update('dev_1', {
  name: 'João Silva Atualizado'
});

// Deletar desenvolvedor
await developerService.delete('dev_1');
```

### Aluno Service

```jsx
import alunoService from '../services/alunoService';

// Mesma interface do developerService
const alunos = await alunoService.findAll();
const aluno = await alunoService.findOne('aluno_1');
const novoAluno = await alunoService.create({...});
await alunoService.update('aluno_1', {...});
await alunoService.delete('aluno_1');
```

### Turma Service

```jsx
import turmaService from '../services/turmaService';

// Mesma interface dos serviços anteriores
const turmas = await turmaService.findAll();
const turma = await turmaService.findOne('turma_1');
const novaTurma = await turmaService.create({...});
await turmaService.update('turma_1', {...});
await turmaService.delete('turma_1');
```

## 🧪 Testando com Mock

Por padrão, o projeto usa mock. Para testar:

1. **Login**: Use `admin@ibrc.com.br` com qualquer senha
2. **Requisições GET**: Retornam dados mockados
3. **Requisições POST/PATCH/DELETE**: Retornam sucesso

### Exemplo de Teste

```jsx
import developerService from '../services/developerService';

async function testAPI() {
  try {
    const developers = await developerService.findAll();
    console.log('Desenvolvedores:', developers);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

## 🚀 Conectando ao Backend Real

Quando o backend NestJS estiver pronto:

1. Atualize `.env.local`:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_USE_MOCK=false
   ```

2. Certifique-se que o backend está rodando em `http://localhost:3000`

3. Os serviços usarão a API real automaticamente

## 🔐 Autenticação com Token

O `apiClient` automaticamente:

1. **Adiciona o token JWT** no header `Authorization` se existir em `localStorage.authToken`
2. **Remove o usuário** se retornar 401 (Unauthorized)
3. **Redireciona para login** em caso de expiração de token

## 📊 Estrutura da API NestJS (Referência)

Com base no repositório referenciado, a API possui:

- **Controller**: `GET /developers`, `POST /developers`, `PATCH /developers/:id`, `DELETE /developers/:id`
- **Entity**: Developer com campos `id`, `name`, `email`, `dateOfBirth`
- **Portas**: 3000 (desenvolvimento)

## 🛠️ Adicionando Novos Serviços

Para adicionar um novo serviço (ex: `usuarioService.js`):

```javascript
import { request } from './api.js';

export const usuarioService = {
  create: async (data) => {
    try {
      const response = await request({
        method: 'POST',
        url: '/usuarios',
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response = await request({
        method: 'GET',
        url: '/usuarios',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  findOne: async (id) => {
    try {
      const response = await request({
        method: 'GET',
        url: `/usuarios/${id}`,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await request({
        method: 'PATCH',
        url: `/usuarios/${id}`,
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await request({
        method: 'DELETE',
        url: `/usuarios/${id}`,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default usuarioService;
```

## ⚠️ Instalação de Dependências

Certifique-se de instalar o axios:

```bash
npm install axios
```

## 📝 Próximos Passos

1. ✅ Serviços de API configurados
2. ✅ Mock ativado por padrão
3. ⏳ Aguardando backend NestJS em produção
4. ⏳ Testes unitários para serviços
5. ⏳ Testes de integração E2E

---

**Dúvidas?** Consulte a estrutura do backend em: https://github.com/phillippelevidad/phillcode-nestjs-backend

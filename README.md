# 📖 IBRC React - Sistema de Gerenciamento de Turmas

Sistema web para gerenciar alunos, turmas e configurações de usuários com autenticação **integrada com API NestJS**.

## 🚀 INÍCIO RÁPIDO (30 segundos)

```bash
npm install
npm run dev
```

**Login:**
- Email: `admin@ibrc.com.br`
- Senha: qualquer coisa

Acesse: http://localhost:5173

---

## 📋 INSTALAÇÃO PASSO A PASSO

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Criar `.env.local`
Na raiz do projeto, crie:
```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=true
```

### 3️⃣ Iniciar Dev Server
```bash
npm run dev
```

### 4️⃣ Fazer Login
- URL: http://localhost:5173/login
- Email: admin@ibrc.com.br
- Senha: qualquer coisa (mock não valida)

---

## 🎯 COMO USAR

### Exemplo Básico (Usar em Componente)

```jsx
import { useEffect } from 'react';
import { useCrud } from '@/hooks/useApi';
import developerService from '@/services/developerService';

export function Developers() {
  const { items, loading, error, readAll, create, update, delete: deleteDev } = 
    useCrud(developerService);

  useEffect(() => {
    readAll();
  }, [readAll]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Desenvolvedores ({items.length})</h1>
      <ul>
        {items.map(dev => (
          <li key={dev.id}>
            <strong>{dev.name}</strong> - {dev.email}
            <button onClick={() => deleteDev(dev.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔌 SERVIÇOS DISPONÍVEIS

### 1. AuthService (Autenticação)

```javascript
import authService from '@/services/authService';

await authService.login('email@example.com', 'senha');
authService.logout();
await authService.register({ email, password, name });
const profile = await authService.getProfile();
await authService.updateProfile({ name: 'Novo Nome' });
```

### 2. DeveloperService (CRUD Desenvolvedores)

```javascript
import developerService from '@/services/developerService';

const devs = await developerService.findAll();
const dev = await developerService.findOne('dev_id');
await developerService.create({
  name: 'João Silva',
  email: 'joao@example.com',
  dateOfBirth: '1990-05-15'
});
await developerService.update('dev_id', { name: 'João Atualizado' });
await developerService.delete('dev_id');
```

### 3. AlunoService (CRUD Alunos)

```javascript
import alunoService from '@/services/alunoService';

// Mesma interface do DeveloperService
const alunos = await alunoService.findAll();
await alunoService.create({ name, email, ... });
```

### 4. TurmaService (CRUD Turmas)

```javascript
import turmaService from '@/services/turmaService';

const turmas = await turmaService.findAll();
```

---

## 🪝 HOOKS CUSTOMIZADOS

### useApiCall() - Para Single Requests

```javascript
import { useApiCall } from '@/hooks/useApi';
import developerService from '@/services/developerService';

const { data, loading, error, execute } = useApiCall(developerService.findAll);

useEffect(() => {
  execute();
}, []);
```

### useCrud() - Para Operações CRUD (RECOMENDADO)

```javascript
const {
  items,        // Array de items
  loading,      // boolean
  error,        // string ou null
  create,       // (data) => Promise
  readAll,      // () => Promise - USE ISTO AO ABRIR PÁGINA
  update,       // (id, data) => Promise
  delete,       // (id) => Promise
} = useCrud(service);
```

---

## 🔐 AUTENTICAÇÃO COM useAuth()

```javascript
import { useAuth } from '@/context/AuthContext';

function LoginComponent() {
  const { login, user, logout, loading, error } = useAuth();

  const success = await login('admin@ibrc.com.br', '123456');
  if (success) {
    console.log('Logado como:', user.name);
  }
}
```

---

## 📁 ESTRUTURA DO PROJETO

```
src/
├── services/        ← Serviços de API
│   ├── api.js      (Axios + Mock)
│   ├── authService.js
│   ├── developerService.js
│   ├── alunoService.js
│   └── turmaService.js
├── hooks/           ← Hooks reutilizáveis
│   └── useApi.js   (useApiCall, useCrud)
├── components/      ← Componentes
├── pages/           ← Páginas
├── context/         ← Estado global (com API)
├── config.js        ← Configurações
└── App.jsx
```

---

## ⚙️ VARIÁVEIS DE AMBIENTE (.env.local)

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=true
```

**Para mudar para API Real (quando backend tiver pronto):**
```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=false
```

---

## 🧪 TESTES E DEBUG

### Verificar se Mock está Funcionando

No console (F12):
```javascript
const { default: devService } = await import('@/services/developerService.js');
const devs = await devService.findAll();
console.log(devs);
```

### Verificar Token e Usuário

```javascript
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

---

## 🐛 PROBLEMAS COMUNS

| Problema | Solução |
|----------|---------|
| "Cannot find module axios" | `npm install axios` |
| Login não funciona | Use: `admin@ibrc.com.br`, verifique `.env.local` |
| Dados não aparecem | Adicione `[readAll]` em useEffect |
| "Cannot read property 'map' of undefined" | Use: `items?.map()` |
| Erro 401 / Token expirado | Faça login novamente |
| CORS Error | Configure CORS no backend NestJS |

---

## ✅ CHECKLIST RÁPIDO

- [ ] Executei `npm install`
- [ ] Criei `.env.local`
- [ ] Executei `npm run dev`
- [ ] Fiz login com admin@ibrc.com.br
- [ ] Criei primeiro componente com useCrud
- [ ] Testei create/read/update/delete
- [ ] Pronto para usar!

---

## 🚀 MUDANDO PARA API REAL

Quando backend NestJS estiver pronto:

1. **Backend rodando:**
```bash
curl http://localhost:3000
```

2. **Mude `.env.local`:**
```env
VITE_USE_MOCK=false
```

3. **Reinicie dev server:**
```bash
npm run dev
```

**Pronto!** Nenhuma mudança no código é necessária! 🎉

---

## 📝 SCRIPTS

```bash
npm run dev      # Inicia servidor local
npm run build    # Build para produção
npm run lint     # Verifica código
npm run preview  # Visualiza build
```

---

## 🛠️ STACK TECNOLÓGICO

- **React 19** - Framework UI
- **Vite** - Build tool
- **React Router v7** - Navegação
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

---

## 📚 REFERÊNCIAS

- **Backend NestJS**: https://github.com/phillippelevidad/phillcode-nestjs-backend
- **React Docs**: https://react.dev
- **Axios Docs**: https://axios-http.com

---

**Status**: ✅ Pronto para usar | **Tempo de Setup**: ~30 segundos

**📚 Documentação Completa**: Veja [API_INTEGRATION.md](./API_INTEGRATION.md)

### Exemplo Rápido

```jsx
import { useCrud } from './hooks/useApi';
import developerService from './services/developerService';

function MeuComponente() {
  const { items, loading, readAll, create } = useCrud(developerService);

  useEffect(() => {
    readAll(); // Carrega lista
  }, [readAll]);

  return (
    <div>
      {loading ? 'Carregando...' : items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 📁 Estrutura do Projeto

```
src/
├── services/        # Serviços de API
│   ├── api.js                  - Config do axios + mock
│   ├── authService.js          - Autenticação
│   ├── developerService.js     - CRUD de Desenvolvedores
│   ├── alunoService.js         - CRUD de Alunos
│   └── turmaService.js         - CRUD de Turmas
├── hooks/           # Hooks customizados
│   └── useApi.js               - useApiCall e useCrud
├── pages/           # Páginas principais
│   ├── Login.jsx           - Autenticação
│   ├── Cadastro.jsx        - Registro de usuários
│   ├── Dashboard.jsx       - Painel inicial
│   ├── Turma.jsx           - Gestão de turmas
│   └── Config.jsx          - Configurações
├── components/      # Componentes reutilizáveis
│   ├── ProtectedRoute.jsx  - Proteção de rotas
│   ├── ModalAluno.jsx      - Modal de alunos
│   ├── ModalTurma.jsx      - Modal de turmas
│   ├── ModalRegistro.jsx   - Modal de registro
│   ├── Sidebar.jsx         - Menu lateral
│   └── examples/           - Exemplos de uso
├── context/         # Estado global (Context API)
│   ├── AuthContext.jsx     - Gerenciamento com API
│   └── DataContext.jsx     - Gerenciamento de dados
├── layouts/         # Layouts
│   └── MainLayout.jsx      - Layout principal protegido
├── config.js        # Configuração global
└── App.jsx          # Rotas da aplicação
```

## 🔄 Fluxo de Autenticação

1. Usuário vai para `/login` (com Mock, use: `admin@ibrc.com.br` / `123456`)
2. `AuthContext` comunica com `authService`
3. Token JWT é armazenado em `localStorage`
4. `ProtectedRoute` valida acesso
5. Dentro: Dashboard, Turmas e Configurações disponíveis

## 🛠️ Stack Tecnológico

- **React 19** - Framework UI
- **Vite** - Build tool
- **React Router v7** - Navegação
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **ESLint** - Linting

## 📝 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run preview` | Preview do build |

## 🔐 Contextos

### AuthContext (com API integrada)
```javascript
- user: Dados do usuário autenticado
- loading: Estado de carregamento
- error: Mensagens de erro
- login(email, password) - Login com API/Mock
- logout() - Logout
- updateUser(data) - Atualizar perfil
```

### DataContext
```javascript
- registros: Lista de registros
- alunos: Lista de alunos
- loading: Estado de carregamento
- error: Mensagens de erro
```

## 🚦 Rotas Disponíveis

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Login (use: admin@ibrc.com.br) |
| `/cadastro` | Público | Registro |
| `/` | Protegido | Dashboard |
| `/turmas` | Protegido | Gerenciar turmas |
| `/configuracoes` | Protegido | Configurações |

## 📦 Dependências Principais

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "axios": "^1.7.7",
  "@tailwindcss/postcss": "^4.1.18",
  "lucide-react": "^0.563.0"
}
```

## 🧪 Testando com Mock

Por padrão, o projeto usa **Mock API**. Nenhuma configuração extra é necessária!

- Login: `admin@ibrc.com.br` (qualquer senha)
- Requisições retornam dados simulados
- Perfeito para desenvolvimento sem backend

## ⚠️ Próximos Passos

1. ✅ Serviços de API configurados
2. ✅ Mock ativado por padrão  
3. ⏳ Quando backend estiver pronto, mude `VITE_USE_MOCK=false`
4. ⏳ Testes unitários
5. ⏳ Testes E2E

## 📚 Referência Backend

Repositório NestJS: https://github.com/phillippelevidad/phillcode-nestjs-backend



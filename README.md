# ⛪ IBRC - Sistema de Gestão de Membros

O **IBRC** é uma solução Full-stack moderna desenvolvida para automatizar e organizar o gerenciamento de membros, turmas, alunos, chamadas e relatórios para a comunidade IBRC. O sistema oferece uma interface intuitiva para administradores e professores, com atualizações em tempo real via WebSockets.

---

## 🛠️ Stack Tecnológica

### **Backend (NestJS)**
- **Framework:** NestJS (Node.js)
- **Banco de Dados:** PostgreSQL com TypeORM
- **Comunicação:** REST API & WebSockets (Socket.io)
- **Segurança:** BcryptJS para hashing de senhas
- **Configuração:** Gerenciamento de ambiente via Nest Config

### **Frontend (Vite + React)**
- **Framework:** React 19
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS (v4)
- **Navegação:** React Router v7
- **Consumo de API:** Axios com suporte a Mocks para desenvolvimento desacoplado

---

## 🚀 Como Iniciar

### 1️⃣ Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### 2️⃣ Configuração do Backend
```bash
# Navegue até o diretório do backend
cd backend-nest

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)
# DATABASE_URL=postgres://usuario:senha@localhost:5432/ibrc_db

# Inicie em modo de desenvolvimento
npm run start:dev
```

### 3️⃣ Configuração do Frontend
```bash
# Navegue até o diretório do frontend
cd frontend

# Instale as dependências
npm install

# Configure o .env.local
# VITE_API_URL=http://localhost:3000
# VITE_USE_MOCK=false (Mude para true para usar dados simulados)

# Inicie o servidor de desenvolvimento
npm run dev
```

### 4️⃣ 🐋 Rodando com Docker (Recomendado para Dev)
Para rodar rapidamente **toda a aplicação com Banco de Dados**, basta usar o Docker:

```bash
# Na raiz do projeto, execute:
docker compose up --build

# O sistema inteiro estará disponível:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3002
# - Banco de Dados: Porta 5432
```

---

## 🚀 Como fazer o Deploy na Vercel

O projeto está totalmente configurado para rodar os dois lados integrados na plataforma Serverless da Vercel!
*(Nota: O WebSockets desativa-se de forma inteligente na nuvem pois a Vercel não suporta essas conexões estáveis, sem quebrar o projeto).*

### 1. Preparação (Banco de Dados em Nuvem)
O Vercel não suporta hospedar o seu PostgreSQL local. Você precisará criar um num cloud:
- Crie um Database gratuito na **Neon** (neon.tech) ou **Supabase**.
- Em seu painel SQL deles, execute o script do seu `IBRC-DB.sql` localizado na pasta `backend-nest` para construir as tabelas.
- Copie a URL de conexão do PostgreSQL informada por eles.

### 2. Subindo o Backend-Nest
1. No Dashboard da Vercel, clique em **Add New Project**.
2. Selecione o repositório deste projeto em seu GitHub.
3. Importante: Em **"Root Directory"**, clique em *Edit* e selecione `backend-nest`.
4. Em **Environment Variables**, adicione `DATABASE_URL` contendo a URL de conexão do passo 1.
5. Clique em **Deploy**. Quando terminar, copie a URL gerada (algo como `https://ibrc-backend.vercel.app`).

### 3. Subindo o Frontend
1. Vá novamente ao Dashboard da Vercel e adicione outro **New Project**, apontando para o mesmo repositório da sua conta Github.
2. Desta vez, altere o **"Root Directory"** selecionando a pasta `frontend`.
3. Na seção **Environment Variables**, adicione uma nova:
   - Key: `VITE_API_URL`
   - Value: `(a URL que foi gerada para o seu backend no final da etapa anterior)`
4. Clique em **Deploy**!
5. Pronto, o aplicativo final está ao vivo ligado remotamente.

---

## 📁 Estrutura do Projeto

```text
ibrc-assembleia/
├── backend-nest/          # Backend em NestJS
│   ├── src/
│   │   ├── admin/         # Gestão administrativa
│   │   ├── students/      # Módulo de alunos
│   │   ├── attendances/   # Controle de presença (chamadas)
│   │   ├── reports/       # Geração de estatísticas e relatórios
│   │   ├── events/        # Gestão de eventos da igreja
│   │   └── assembly/      # Controle de assembleias
│   └── IBRC-DB.sql        # Script de exportação do banco
├── frontend/              # App React (Vite)
│   ├── src/
│   │   ├── components/    # UI Reutilizável
│   │   ├── context/       # Auth e Data Contexts
│   │   ├── hooks/         # Custom Hooks (useCrud, useApi)
│   │   ├── pages/         # Telas da aplicação (Dashboard, Turmas, Config)
│   │   └── services/      # Integração com API (Auth, Aluno, Turma)
└── README.md              # Documentação principal
```

---

## 🎯 Desenvolvimento Frontend (Hooks & Serviços)

O frontend utiliza um padrão de hooks customizados para abstrair chamadas de API:

### **useCrud()** - Operações CRUD simplificadas
```jsx
const { items, loading, readAll, create, update, delete: remove } = useCrud(alunoService);

useEffect(() => {
  readAll(); // Carrega os dados ao montar o componente
}, [readAll]);
```

### **useAuth()** - Contexto de Autenticação
```jsx
const { login, user, logout } = useAuth();
// Use para gerenciar o estado global do usuário e permissões.
```

---

## 🌟 Funcionalidades Principais

- **📊 Dashboard:** Visão consolidada de presenças e crescimento.
- **👥 Chamada Digital:** Registro de presença rápido com feedback visual.
- **📈 Relatórios Automatizados:** Filtros por data e exportação de dados.
- **🔐 Segurança:** Autenticação JWT e proteção de rotas no frontend.
- **🔌 Modo Híbrido:** Suporte total a Mock API para testes rápidos sem backend.

---

## 🩹 Solução de Problemas

| Problema | Solução |
| :--- | :--- |
| **Erro de Conexão DB** | Verifique a `DATABASE_URL` no `.env` do backend. |
| **CORS Error** | Configure as origens permitidas no `main.ts` do backend. |
| **Mock não funciona** | Verifique se `VITE_USE_MOCK=true` está no `.env.local` do frontend. |

---

## ✅ Checklist de Implementação

- [x] Arquitetura Full-stack definida
- [x] Backend NestJS com TypeORM/Postgres
- [x] Frontend React com Vite e Tailwind
- [x] Sistema de Autenticação JWT
- [x] Chamadas de API abstraídas em hooks
- [ ] Documentação de API (Swagger)
- [ ] Testes de Integração

---

Desenhado com ❤️ pela equipe **IBRC**.

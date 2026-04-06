# =============================================
# Stage 1: Build
# =============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro (melhor cache)
COPY package.json package-lock.json ./

# Instalar TODAS as dependências (incluindo devDependencies para compilar)
RUN npm ci

# Copiar o resto do código-fonte
COPY . .

# Compilar TypeScript -> JavaScript
RUN npm run build

# =============================================
# Stage 2: Produção
# =============================================
FROM node:18-alpine AS production

WORKDIR /app

# Copiar apenas package.json para instalar deps de produção
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Copiar o código compilado do stage anterior
COPY --from=builder /app/dist ./dist

# Expor a porta do backend
EXPOSE 3002

# Comando para iniciar o servidor
CMD ["node", "dist/main.js"]

FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar o código-fonte
COPY . .

# Expor a porta do Vite
EXPOSE 5173

# Rodar em modo dev (com --host para ser acessível fora do container)
CMD ["npm", "run", "dev"]

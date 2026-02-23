#!/bin/bash
# 📋 Scripts Úteis para Desenvolvimento

# ============================================================================
# 🚀 COMEÇAR DO ZERO
# ============================================================================

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# ============================================================================
# 🧪 TESTES E DEBUG
# ============================================================================

# Verificar se axios foi instalado
npm list axios

# Limpas cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# ============================================================================
# 🏗️ COMPILAÇÃO
# ============================================================================

# Build para produção
npm run build

# Visualizar build
npm run preview

# ============================================================================
# ✅ VERIFICAÇÃO
# ============================================================================

# Linting
npm run lint

# Verificar variáveis de ambiente
echo "=== .env.local ==="
cat .env.local

# Verificar arquivo de serviço
echo "=== API Services ==="
ls -la src/services/

# ============================================================================
# 📂 ESTRUTURA DE DIRETÓRIOS
# ============================================================================

# Ver estrutura completa
tree src -I node_modules

# Ver arquivos de serviço
ls -la src/services/

# Ver documentação
ls -la *.md

# ============================================================================
# 🧪 TESTES MANUAIS (no console do navegador)
# ============================================================================

# Verificar mock
console.log('USE_MOCK:', process.env.VITE_USE_MOCK);

# Verificar token
console.log('Token:', localStorage.getItem('authToken'));

# Verificar usuário
console.log('User:', localStorage.getItem('user'));

# Testar requisição mock
(async () => {
  const { default: devService } = await import('@/services/developerService.js');
  const devs = await devService.findAll();
  console.log('Developers:', devs);
})();

# ============================================================================
# 🔄 ALTERNÂNCIA MOCK ↔ API REAL
# ============================================================================

# Usar Mock (desenvolvimento)
echo "VITE_API_URL=http://localhost:3000" > .env.local
echo "VITE_USE_MOCK=true" >> .env.local
npm run dev

# Usar API Real (quando backend pronto)
echo "VITE_API_URL=http://localhost:3000" > .env.local
echo "VITE_USE_MOCK=false" >> .env.local
npm run dev

# ============================================================================
# 📦 GERENCIAMENTO DE DEPENDÊNCIAS
# ============================================================================

# Listar dependências instaladas
npm list

# Atualizar todas as dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Adicionar nova dependência
npm install nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# ============================================================================
# 🐛 DEBUG
# ============================================================================

# Verificar porta 5173 (Vite)
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux

# Verificar porta 3000 (Backend)
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# ============================================================================
# 📝 DOCUMENTAÇÃO
# ============================================================================

# Ver índice de documentação
cat DOCUMENTATION_INDEX.md

# Ver guia rápido
cat QUICK_REFERENCE.md

# Ver troubleshooting
cat TROUBLESHOOTING.md

# ============================================================================
# 🚀 DEPLOY
# ============================================================================

# Build + Preview local
npm run build && npm run preview

# Deploy (exemplo Vercel)
# npm run build
# vercel deploy --prod

# Deploy (exemplo Netlify)
# npm run build
# netlify deploy --prod --dir=dist

# ============================================================================
# 💾 LIMPEZA
# ============================================================================

# Limpar console (alias útil)
alias clear='printf "\033c"'

# Remover node_modules e reinstalar
rm -rf node_modules && npm install

# Remover build e reconstruir
rm -rf dist && npm run build

# ============================================================================
# 🔍 BUSCAS ÚTEIS
# ============================================================================

# Procurar TODO
grep -r "TODO" src/

# Procurar FIXME
grep -r "FIXME" src/

# Procurar console.log (remover antes de deploy)
grep -r "console.log" src/

# Procurar por serviços de API
find src/services -name "*.js"

# ============================================================================
# 📊 ESTATÍSTICAS
# ============================================================================

# Contar linhas de código
find src -name "*.js" -o -name "*.jsx" | xargs wc -l

# Contar arquivos
find src -type f | wc -l

# Tamanho total
du -sh .

# ============================================================================
# 🌐 TESTES DE CONECTIVIDADE
# ============================================================================

# Verificar se backend está rodando
curl http://localhost:3000

# Verificar CORS (teste POST simples)
curl -X POST http://localhost:3000/test -H "Content-Type: application/json"

# ============================================================================
# 📚 DICAS IMPORTANTES
# ============================================================================

# Depois de instalar nova dependência, reinicie o servidor:
# Ctrl+C
# npm run dev

# Depois de alterar .env.local, reinicie o servidor:
# Ctrl+C
# npm run dev

# Para ver variáveis de ambiente em runtime:
# console.log(import.meta.env)

# ============================================================================

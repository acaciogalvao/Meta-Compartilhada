# Quick Start - Meta Compartilhada

Guia rápido para iniciar o projeto em 5 minutos!

## ⚡ Inicialização Rápida

### 1. Clonar o Repositório
```bash
git clone https://github.com/acaciogalvao/Meta-Compartilhada.git
cd Meta-Compartilhada
```

### 2. Executar Setup
```bash
./setup.sh
```

Este script irá:
- ✅ Verificar Node.js
- ✅ Criar arquivos .env
- ✅ Instalar todas as dependências

### 3. Configurar Variáveis de Ambiente

#### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/meta-compartilhada
CORS_ORIGIN=http://localhost:8081,exp://localhost:8081
```

Se usar MongoDB remoto (Atlas):
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/meta-compartilhada
```

#### Mobile (`mobile/.env.local`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Iniciar Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Você verá:
```
╔════════════════════════════════════════╗
║   Meta Compartilhada - Backend API    ║
╠════════════════════════════════════════╣
║  Servidor rodando em: http://localhost:3000
║  Ambiente: development
║  MongoDB: mongodb://localhost:27017/meta-compartilhada
╚════════════════════════════════════════╝
```

### 5. Iniciar Mobile (Terminal 2)
```bash
cd mobile
npm run dev
```

Você verá um QR code no terminal.

### 6. Escanear QR Code

**iOS:**
- Abra a câmera
- Aponte para o QR code
- Clique no link "Open with Expo Go"

**Android:**
- Abra o Expo Go
- Clique em "Scan QR code"
- Aponte para o QR code

## 🚀 Usando no Termux

### 1. Instalar Node.js
```bash
pkg install nodejs
```

### 2. Clonar Repositório
```bash
git clone https://github.com/acaciogalvao/Meta-Compartilhada.git
cd Meta-Compartilhada
```

### 3. Setup
```bash
bash setup.sh
```

### 4. Configurar MongoDB

**Opção A: MongoDB Local (Termux)**
```bash
pkg install mongodb
mongod
```

**Opção B: MongoDB Remoto (Recomendado)**
- Criar conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Copiar connection string
- Editar `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/meta-compartilhada
```

### 5. Iniciar Backend
```bash
cd backend
npm run dev
```

### 6. Iniciar Mobile (Outro Terminal)
```bash
cd mobile
npm run dev
```

## 🧪 Testar a API

### Health Check
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-04-14T22:30:00.000Z"
}
```

### Criar Meta
```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Viagem",
    "totalValue": 5000,
    "months": 12,
    "contributionP1": 208.33,
    "nameP1": "João",
    "nameP2": "Maria"
  }'
```

### Listar Metas
```bash
curl http://localhost:3000/api/goals
```

## 📱 Primeiros Passos no App

1. **Abrir o app** - Escaneie o QR code
2. **Ir para aba "Metas"** - Clique na aba inferior
3. **Criar meta** - Clique no botão "+"
4. **Preencher formulário**:
   - Nome do item: "Viagem"
   - Valor total: "5000"
   - Meses: "12"
   - Contribuição P1: "208.33"
   - Nome P1: "João"
   - Nome P2: "Maria"
5. **Clicar em "Criar Meta"**
6. **Visualizar meta** - Clique na meta criada
7. **Registrar pagamento**:
   - Selecionar quem pagou
   - Inserir valor
   - Clicar em "Registrar Pagamento"

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```
Solução:
1. Verificar se MongoDB está rodando
2. Ou usar MongoDB remoto (Atlas)
3. Editar backend/.env com URL correta
```

### "Port 3000 already in use"
```bash
# Mudar porta em backend/.env
PORT=3001

# Ou matar processo na porta 3000
lsof -i :3000
kill -9 <PID>
```

### "API URL not found"
```
Solução:
1. Verificar se backend está rodando
2. Editar mobile/.env.local com URL correta
3. Verificar CORS_ORIGIN em backend/.env
```

### "QR Code não aparece"
```bash
# Tentar em outro terminal
cd mobile
npm run dev

# Ou usar web:
npm run dev -- --web
```

## 📚 Documentação Completa

- [README.md](./README_NOVO.md) - Visão geral do projeto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [backend/README.md](./backend/README.md) - Documentação do backend
- [mobile/README.md](./mobile/README.md) - Documentação do mobile

## 🎯 Próximos Passos

Após o setup inicial:

1. **Explorar a UI** - Teste todas as funcionalidades
2. **Ler ARCHITECTURE.md** - Entenda a estrutura
3. **Modificar componentes** - Customize conforme necessário
4. **Adicionar features** - Crie novas funcionalidades

## 💡 Dicas

- Use `npm run dev` para desenvolvimento com hot reload
- Pressione `r` no terminal para recarregar o app
- Use `w` para abrir versão web do app
- Consulte os logs do backend para debug

## 🆘 Precisa de Ajuda?

1. Verifique os READMEs do backend e mobile
2. Consulte ARCHITECTURE.md para entender a estrutura
3. Abra uma issue no GitHub
4. Verifique os logs de erro no terminal

---

**Pronto para começar? Execute `./setup.sh` e aproveite! 🚀**

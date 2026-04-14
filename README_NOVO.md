# Meta Compartilhada 🎯

Aplicativo modularizado para gerenciar metas compartilhadas entre duas pessoas. Economize juntos, alcance seus objetivos!

## 📱 Sobre o Projeto

Meta Compartilhada é uma solução completa para casal ou amigos que desejam economizar juntos para um objetivo comum. O projeto é totalmente modularizado, com frontend mobile (Expo/React Native), backend Node.js e banco de dados MongoDB.

### Características Principais

- ✅ **Criar metas compartilhadas** com valor total e prazo
- ✅ **Registrar contribuições** de ambas as pessoas
- ✅ **Acompanhar progresso** em tempo real
- ✅ **Histórico de pagamentos** detalhado
- ✅ **Interface mobile-first** responsiva
- ✅ **Backend modularizado** e escalável
- ✅ **Sem dependências externas** (Google Studio, etc)

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- MongoDB (local ou remoto)
- npm ou pnpm

### 1. Clonar Repositório

```bash
git clone https://github.com/acaciogalvao/Meta-Compartilhada.git
cd Meta-Compartilhada
```

### 2. Configurar Backend

```bash
cd backend
cp .env.example .env
# Editar .env com suas configurações MongoDB
npm install
npm run dev
```

O backend estará disponível em `http://localhost:3000`

### 3. Configurar Mobile

```bash
cd mobile
cp .env.example .env.local
# Editar .env.local com a URL da API (http://localhost:3000/api)
npm install
npm run dev
```

Escaneie o QR code com Expo Go no seu dispositivo!

## 📁 Estrutura do Projeto

```
Meta-Compartilhada/
├── mobile/              # Frontend Expo/React Native
│   ├── app/            # Rotas e telas
│   ├── components/     # Componentes reutilizáveis
│   ├── hooks/          # Hooks customizados
│   ├── lib/            # Serviços e utilitários
│   └── README.md       # Documentação do mobile
│
├── backend/            # Backend Node.js + Express
│   ├── src/
│   │   ├── config/     # Configurações
│   │   ├── controllers/# Lógica de negócio
│   │   ├── models/     # Schemas MongoDB
│   │   ├── routes/     # Rotas da API
│   │   └── middleware/ # Middlewares
│   └── README.md       # Documentação do backend
│
├── docs/               # Documentação adicional
├── ARCHITECTURE.md     # Arquitetura do projeto
└── README.md           # Este arquivo
```

## 🔌 API Endpoints

### Goals (Metas)

```http
GET    /api/goals              # Listar todas as metas
GET    /api/goals/:id          # Obter meta específica
POST   /api/goals              # Criar nova meta
PUT    /api/goals/:id          # Atualizar meta
DELETE /api/goals/:id          # Deletar meta
POST   /api/goals/:id/payments # Adicionar pagamento
GET    /api/goals/:id/progress # Obter progresso
```

## 📱 Telas do Aplicativo

### Home
- Bem-vindo ao usuário
- Atalhos rápidos
- Resumo de metas

### Metas
- Lista de todas as metas
- Progresso visual de cada meta
- Botão para criar nova meta
- Opção de deletar meta

### Criar Meta
- Formulário com validação
- Campos: nome, valor total, meses, contribuições, nomes
- Feedback de erros
- Cancelar ou confirmar

### Detalhes da Meta
- Progresso detalhado
- Contribuições de ambas as pessoas
- Histórico de pagamentos
- Registrar novo pagamento

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Expo SDK 54** - Framework mobile
- **React Native 0.81** - UI nativa
- **TypeScript** - Tipagem estática
- **NativeWind** - Tailwind CSS
- **Expo Router** - Navegação
- **Axios** - Cliente HTTP
- **Zod** - Validação de dados

### Backend
- **Express.js** - Framework web
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados
- **Mongoose** - ODM
- **Nodemon** - Recarregamento automático
- **Zod** - Validação de dados

## 🚀 Execução no Termux

### Backend no Termux

```bash
# Instalar Node.js
pkg install nodejs

# Clonar e instalar
cd backend
npm install

# Configurar MongoDB (local ou remoto)
# Editar .env com MONGODB_URI

# Iniciar servidor
npm run dev
```

### Mobile no Termux

```bash
# Instalar Node.js e Expo
pkg install nodejs
npm install -g expo-cli

# Instalar dependências
cd mobile
npm install

# Iniciar servidor
npm run dev

# Escanear QR code com Expo Go
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/meta-compartilhada
CORS_ORIGIN=http://localhost:8081
```

### Mobile (.env.local)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 🔐 Segurança

- ✅ Validação de entrada com Zod
- ✅ Tratamento centralizado de erros
- ✅ CORS configurável
- ✅ Variáveis de ambiente para dados sensíveis
- ✅ Sem armazenamento de senhas (MVP)

## 📊 Modelos de Dados

### Goal (Meta)
```typescript
{
  _id: ObjectId,
  itemName: string,           // Ex: "Viagem"
  totalValue: number,         // Ex: 5000
  months: number,             // Ex: 12
  contributionP1: number,     // Ex: 208.33
  nameP1: string,             // Ex: "João"
  nameP2: string,             // Ex: "Maria"
  savedP1: number,            // Valor economizado P1
  savedP2: number,            // Valor economizado P2
  payments: Payment[],        // Histórico
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Fluxo de Desenvolvimento

1. **Backend**: Criar modelo, controller e rotas
2. **Frontend**: Criar hook, componentes e telas
3. **Integração**: Conectar frontend com backend
4. **Testes**: Validar fluxo completo

## 📚 Documentação Detalhada

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do projeto
- [backend/README.md](./backend/README.md) - Documentação do backend
- [mobile/README.md](./mobile/README.md) - Documentação do mobile

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB
```bash
# Verificar se MongoDB está rodando
# Ou editar .env com URL remota
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/meta-compartilhada
```

### Mobile não conecta ao backend
```bash
# Verificar se backend está rodando em http://localhost:3000
# Editar mobile/.env.local com URL correta
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Porta 3000 já está em uso
```bash
# Mudar porta no backend/.env
PORT=3001
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma issue no GitHub
2. Verifique a documentação em ARCHITECTURE.md
3. Consulte os READMEs do backend e mobile

## 🎯 Roadmap

- [ ] Autenticação com JWT
- [ ] Notificações push
- [ ] Modo offline com sincronização
- [ ] Compartilhamento de metas
- [ ] Relatórios e gráficos
- [ ] Integração com Pix/Mercado Pago
- [ ] Suporte a múltiplas metas
- [ ] Testes automatizados

---

**Desenvolvido com ❤️ para ajudar casais e amigos a economizarem juntos!**

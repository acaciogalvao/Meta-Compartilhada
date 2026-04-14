# Backend - Meta Compartilhada

Backend Node.js modularizado com Express, MongoDB e API REST estruturada para o aplicativo Meta Compartilhada.

## 🚀 Características

- **Express.js** - Framework web rápido e minimalista
- **MongoDB** - Banco de dados NoSQL
- **Nodemon** - Recarregamento automático em desenvolvimento
- **TypeScript** - Tipagem estática para maior segurança
- **Zod** - Validação de dados em tempo de execução
- **CORS** - Configuração flexível de origens permitidas
- **Modularização** - Estrutura clara com controllers, routes, models e middleware

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração do MongoDB
│   ├── controllers/
│   │   └── goalController.ts    # Lógica de negócio para metas
│   ├── middleware/
│   │   ├── cors.ts              # Configuração de CORS
│   │   └── errorHandler.ts      # Tratamento de erros
│   ├── models/
│   │   └── Goal.ts              # Schema do Mongoose
│   ├── routes/
│   │   └── goalRoutes.ts        # Definição de rotas
│   └── index.ts                 # Ponto de entrada da aplicação
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- MongoDB local ou conexão remota

### Passos

1. **Instalar dependências**:
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente**:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. **Iniciar o servidor em desenvolvimento**:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do servidor | `3000` |
| `MONGODB_URI` | URL de conexão MongoDB | `mongodb://localhost:27017/meta-compartilhada` |
| `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) | `http://localhost:8081` |

## 🔌 API Endpoints

### Goals (Metas)

#### Listar todas as metas
```http
GET /api/goals
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "itemName": "Viagem",
      "totalValue": 5000,
      "months": 12,
      "contributionP1": 208.33,
      "nameP1": "João",
      "nameP2": "Maria",
      "savedP1": 1000,
      "savedP2": 800,
      "payments": []
    }
  ]
}
```

#### Obter meta específica
```http
GET /api/goals/:id
```

#### Criar nova meta
```http
POST /api/goals
Content-Type: application/json

{
  "itemName": "Viagem",
  "totalValue": 5000,
  "months": 12,
  "contributionP1": 208.33,
  "nameP1": "João",
  "nameP2": "Maria"
}
```

#### Atualizar meta
```http
PUT /api/goals/:id
Content-Type: application/json

{
  "itemName": "Viagem Atualizada",
  "totalValue": 6000
}
```

#### Deletar meta
```http
DELETE /api/goals/:id
```

#### Adicionar pagamento
```http
POST /api/goals/:id/payments
Content-Type: application/json

{
  "paymentId": "PAY123",
  "amount": 500,
  "payerId": "João"
}
```

#### Obter progresso da meta
```http
GET /api/goals/:id/progress
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "totalValue": 5000,
    "totalSaved": 1800,
    "savedP1": 1000,
    "savedP2": 800,
    "progressPercentage": 36,
    "isComplete": false
  }
}
```

## 🛠️ Scripts

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia o servidor em produção
- `npm run lint` - Verifica tipos TypeScript

## 📦 Dependências Principais

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Middleware de CORS
- **zod** - Validação de dados
- **typescript** - Linguagem com tipagem estática
- **nodemon** - Recarregamento automático em desenvolvimento

## 🚀 Execução no Termux

Para executar no Termux (Android):

1. **Instalar Node.js**:
```bash
pkg install nodejs
```

2. **Clonar o repositório e instalar dependências**:
```bash
cd backend
npm install
```

3. **Configurar MongoDB** (local ou remoto):
```bash
# Se usar MongoDB local, instale:
pkg install mongodb

# Ou configure MONGODB_URI para um servidor remoto
```

4. **Iniciar o servidor**:
```bash
npm run dev
```

## 🔒 Segurança

- Validação de entrada com Zod
- Tratamento centralizado de erros
- CORS configurável
- Variáveis de ambiente para dados sensíveis

## 📚 Próximos Passos

- [ ] Adicionar autenticação (JWT)
- [ ] Implementar rate limiting
- [ ] Adicionar testes unitários
- [ ] Configurar logging estruturado
- [ ] Adicionar documentação Swagger/OpenAPI

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

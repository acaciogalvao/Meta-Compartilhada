# Arquitetura - Meta Compartilhada

Documentação da arquitetura modularizada do projeto Meta Compartilhada.

## 🏗️ Visão Geral

O projeto segue uma arquitetura de **três camadas**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Mobile)                        │
│              Expo + React Native + NativeWind               │
│  (mobile/)                                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Backend (API)                            │
│            Express.js + TypeScript + Nodemon               │
│  (backend/)                                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Driver
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Database (MongoDB)                        │
│                                                             │
│  (Local ou Remoto)                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Pastas

```
Meta-Compartilhada/
├── mobile/                 # Frontend Expo/React Native
│   ├── app/               # Rotas e telas
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks customizados
│   ├── lib/
│   │   └── services/      # Serviços (API, etc)
│   ├── assets/            # Imagens, ícones
│   └── package.json
│
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configurações (DB, etc)
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── models/        # Schemas Mongoose
│   │   ├── routes/        # Definição de rotas
│   │   ├── middleware/    # Middlewares
│   │   └── index.ts       # Entrada da aplicação
│   └── package.json
│
├── docs/                  # Documentação adicional
├── README.md              # Readme principal
├── ARCHITECTURE.md        # Este arquivo
├── .env.example           # Variáveis de ambiente
└── .gitignore
```

## 🔄 Fluxo de Dados

### Criar Nova Meta

```
┌─────────────────────┐
│  Tela: Create Goal  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  GoalForm Component                 │
│  - Validação com Zod                │
│  - Feedback visual de erros         │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  useGoals Hook                      │
│  - Chama apiService.createGoal()    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  apiService (lib/services/api.ts)   │
│  - POST /api/goals                  │
│  - Axios HTTP Client                │
└──────────┬──────────────────────────┘
           │ HTTP
           ▼
┌─────────────────────────────────────┐
│  Backend: POST /api/goals           │
│  - goalController.createGoal()      │
│  - Validação com Zod                │
│  - Salva no MongoDB                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  MongoDB                            │
│  - Insere documento Goal            │
└─────────────────────────────────────┘
```

## 🔌 Endpoints da API

### Goals (Metas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/goals` | Listar todas as metas |
| GET | `/api/goals/:id` | Obter meta específica |
| POST | `/api/goals` | Criar nova meta |
| PUT | `/api/goals/:id` | Atualizar meta |
| DELETE | `/api/goals/:id` | Deletar meta |
| POST | `/api/goals/:id/payments` | Adicionar pagamento |
| GET | `/api/goals/:id/progress` | Obter progresso |

## 🛠️ Modularização

### Frontend (Mobile)

#### Componentes
- **GoalCard**: Exibe resumo de uma meta
- **GoalForm**: Formulário para criar/editar meta
- **ScreenContainer**: Wrapper com SafeArea

#### Hooks
- **useGoals**: Gerencia estado e operações de metas
- **useColors**: Acessa cores do tema
- **useColorScheme**: Detecta esquema de cores

#### Serviços
- **apiService**: Cliente HTTP para comunicação com backend

### Backend (API)

#### Controllers
- **goalController**: Lógica de negócio para metas

#### Models
- **Goal**: Schema Mongoose para metas

#### Routes
- **goalRoutes**: Definição de rotas de metas

#### Middleware
- **cors**: Configuração de CORS
- **errorHandler**: Tratamento centralizado de erros

#### Config
- **database**: Conexão com MongoDB

## 🔐 Segurança

### Frontend
- Validação de entrada com Zod
- Tratamento de erros com feedback visual
- Variáveis de ambiente para URLs sensíveis

### Backend
- Validação de entrada com Zod
- Tratamento centralizado de erros
- CORS configurável
- Variáveis de ambiente para dados sensíveis

## 📊 Modelos de Dados

### Goal
```typescript
{
  _id: ObjectId,
  itemName: string,           // Nome do item (ex: Viagem)
  totalValue: number,         // Valor total a economizar
  months: number,             // Meses para economizar
  contributionP1: number,     // Contribuição mensal pessoa 1
  nameP1: string,             // Nome da pessoa 1
  nameP2: string,             // Nome da pessoa 2
  savedP1: number,            // Valor economizado pessoa 1
  savedP2: number,            // Valor economizado pessoa 2
  payments: Payment[],        // Histórico de pagamentos
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```typescript
{
  paymentId: string,          // ID único do pagamento
  amount: number,             // Valor do pagamento
  payerId: string,            // Quem fez o pagamento
  date: Date                  // Data do pagamento
}
```

## 🚀 Execução no Termux

### Backend
```bash
cd backend
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm run dev
```

## 🔄 Fluxo de Desenvolvimento

1. **Criar feature no backend**
   - Adicionar modelo (se necessário)
   - Criar controller
   - Criar rotas
   - Testar com curl/Postman

2. **Criar feature no frontend**
   - Criar hook customizado (se necessário)
   - Criar componentes
   - Criar tela
   - Integrar com API

3. **Validar integração**
   - Testar fluxo completo
   - Verificar tratamento de erros
   - Testar em diferentes dispositivos

## 📝 Convenções de Código

### Nomes de Arquivos
- Componentes: PascalCase (GoalCard.tsx)
- Hooks: camelCase com prefixo "use" (useGoals.ts)
- Serviços: camelCase (api.ts)
- Controllers: camelCase com sufixo "Controller" (goalController.ts)

### Nomes de Variáveis
- Constantes: UPPER_SNAKE_CASE
- Variáveis: camelCase
- Tipos/Interfaces: PascalCase

### Estrutura de Componentes
```tsx
// Imports
import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';

// Interface de Props
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// Componente
export function MyComponent({ title, onPress }: MyComponentProps) {
  const colors = useColors();
  
  return (
    <View className="p-4">
      <Text className="text-foreground">{title}</Text>
    </View>
  );
}
```

## 🔗 Comunicação Frontend-Backend

### Request
```typescript
// Frontend
const response = await apiService.createGoal({
  itemName: 'Viagem',
  totalValue: 5000,
  // ...
});
```

### Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "itemName": "Viagem",
    // ...
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

## 📚 Próximas Melhorias

- [ ] Adicionar autenticação JWT
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting
- [ ] Implementar cache no frontend
- [ ] Adicionar testes unitários
- [ ] Implementar CI/CD
- [ ] Adicionar logging estruturado
- [ ] Implementar WebSocket para atualizações em tempo real

## 📞 Suporte

Para dúvidas sobre a arquitetura, abra uma issue no repositório.

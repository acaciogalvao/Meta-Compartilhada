# Mobile App - Meta Compartilhada

Aplicativo mobile modularizado com Expo, React Native e Tailwind CSS (NativeWind) para gerenciar metas compartilhadas entre duas pessoas.

## 🚀 Características

- **Expo SDK 54** - Framework para desenvolvimento mobile
- **React Native 0.81** - Framework UI nativo
- **TypeScript** - Tipagem estática
- **NativeWind** - Tailwind CSS para React Native
- **Expo Router** - Navegação declarativa
- **React Query** - Gerenciamento de estado do servidor
- **Mobile-First** - Design otimizado para dispositivos móveis
- **Modularizado** - Componentes, hooks e serviços bem organizados

## 📁 Estrutura do Projeto

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Layout de abas
│   │   ├── index.tsx          # Tela Home
│   │   └── goals.tsx          # Tela de Metas
│   ├── create-goal.tsx        # Tela de Criação de Meta
│   ├── goal-detail/
│   │   └── [id].tsx           # Tela de Detalhes da Meta
│   ├── _layout.tsx            # Layout raiz
│   └── oauth/                 # Callbacks de autenticação
├── components/
│   ├── GoalCard.tsx           # Card de meta
│   ├── GoalForm.tsx           # Formulário de meta
│   ├── screen-container.tsx   # Container com SafeArea
│   ├── themed-view.tsx        # View com tema
│   ├── haptic-tab.tsx         # Tab com feedback háptico
│   └── ui/
│       └── icon-symbol.tsx    # Mapeamento de ícones
├── hooks/
│   ├── useGoals.ts            # Hook para gerenciar metas
│   ├── use-colors.ts          # Hook para cores do tema
│   ├── use-color-scheme.ts    # Hook para esquema de cores
│   └── use-auth.ts            # Hook para autenticação
├── lib/
│   ├── services/
│   │   └── api.ts             # Serviço de API
│   ├── theme-provider.tsx     # Provider de tema
│   ├── trpc.ts                # Cliente tRPC
│   └── utils.ts               # Utilitários (cn)
├── constants/
│   └── theme.ts               # Constantes de tema
├── assets/
│   └── images/                # Ícones e splash
├── app.config.ts              # Configuração do Expo
├── tailwind.config.js         # Configuração do Tailwind
├── theme.config.js            # Configuração de cores
└── package.json
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm)
- Expo CLI

### Passos

1. **Instalar dependências**:
```bash
cd mobile
pnpm install
# ou
npm install
```

2. **Configurar variáveis de ambiente**:
```bash
cp .env.example .env.local
# Editar .env.local com a URL da API
```

3. **Iniciar o servidor de desenvolvimento**:
```bash
pnpm dev
# ou
npm run dev
```

4. **Escanear QR code com Expo Go**:
   - iOS: Abra a câmera e aponte para o QR code
   - Android: Abra o Expo Go e escaneie o QR code

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `EXPO_PUBLIC_API_URL` | URL da API backend | `http://localhost:3000/api` |

## 🎯 Fluxos Principais

### 1. Visualizar Metas
- Usuário abre a aba "Metas"
- Aplicativo busca todas as metas do backend
- Exibe lista de metas com progresso visual

### 2. Criar Nova Meta
- Usuário clica no botão "+"
- Preenche formulário com dados da meta
- Aplicativo valida dados e envia para backend
- Retorna para lista de metas

### 3. Visualizar Detalhes
- Usuário clica em uma meta
- Exibe detalhes completos e histórico de pagamentos
- Permite registrar novo pagamento

### 4. Registrar Pagamento
- Usuário seleciona quem fez o pagamento
- Insere valor do pagamento
- Aplicativo atualiza progresso em tempo real

## 🎨 Design System

### Cores (Tailwind)
- `primary` - Cor principal (azul)
- `background` - Fundo da tela
- `surface` - Fundo de cards
- `foreground` - Texto principal
- `muted` - Texto secundário
- `border` - Bordas
- `success` - Sucesso
- `warning` - Aviso
- `error` - Erro

### Componentes Reutilizáveis

#### ScreenContainer
Wrapper para telas que gerencia SafeArea e background:
```tsx
<ScreenContainer className="p-4">
  <Text>Conteúdo da tela</Text>
</ScreenContainer>
```

#### GoalCard
Card para exibir meta com progresso:
```tsx
<GoalCard
  id={goal._id}
  itemName={goal.itemName}
  totalValue={goal.totalValue}
  savedP1={goal.savedP1}
  savedP2={goal.savedP2}
  nameP1={goal.nameP1}
  nameP2={goal.nameP2}
  onPress={() => handlePress()}
  onDelete={() => handleDelete()}
/>
```

#### GoalForm
Formulário para criar/editar meta:
```tsx
<GoalForm
  initialData={initialData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={loading}
  submitLabel="Criar Meta"
/>
```

## 🔌 Integração com Backend

O aplicativo se conecta ao backend através do serviço `apiService`:

```typescript
import { apiService } from '@/lib/services/api';

// Buscar todas as metas
const response = await apiService.getAllGoals();

// Criar nova meta
const newGoal = await apiService.createGoal(goalData);

// Adicionar pagamento
await apiService.addPaymentToGoal(goalId, payment);
```

## 🚀 Execução no Termux

Para executar no Termux (Android):

1. **Instalar Node.js**:
```bash
pkg install nodejs
```

2. **Instalar Expo CLI globalmente**:
```bash
npm install -g expo-cli
```

3. **Instalar dependências do projeto**:
```bash
cd mobile
npm install
```

4. **Iniciar servidor de desenvolvimento**:
```bash
npm run dev
```

5. **Abrir Expo Go no seu dispositivo e escanear o QR code**

## 📱 Testando em Dispositivos

### iOS
- Abra a câmera e aponte para o QR code
- Clique no link "Open with Expo Go"

### Android
- Abra o Expo Go
- Clique em "Scan QR code"
- Aponte para o QR code

### Web
- O aplicativo também funciona em navegadores web
- Acesse a URL fornecida no terminal

## 🛠️ Scripts

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Compila para produção
- `pnpm start` - Inicia servidor em produção
- `pnpm lint` - Verifica tipos TypeScript
- `pnpm format` - Formata código com Prettier
- `pnpm test` - Executa testes
- `pnpm android` - Abre em emulador Android
- `pnpm ios` - Abre em simulador iOS

## 📦 Dependências Principais

- **expo** - Framework para desenvolvimento mobile
- **react-native** - Framework UI nativo
- **expo-router** - Navegação
- **nativewind** - Tailwind CSS para React Native
- **@tanstack/react-query** - Gerenciamento de estado do servidor
- **axios** - Cliente HTTP
- **zod** - Validação de dados

## 🔒 Segurança

- Validação de entrada em formulários
- Tratamento de erros centralizado
- Variáveis de ambiente para dados sensíveis
- HTTPS para comunicação com backend

## 📚 Próximos Passos

- [ ] Adicionar autenticação com JWT
- [ ] Implementar notificações push
- [ ] Adicionar modo offline com sincronização
- [ ] Implementar testes unitários
- [ ] Adicionar tela de configurações
- [ ] Implementar compartilhamento de metas

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

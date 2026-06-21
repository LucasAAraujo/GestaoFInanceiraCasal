# Frontend — React + Vite + TypeScript

## 1) Stack

| Tecnologia | Função |
|------------|--------|
| **React 18+** | UI library |
| **Vite** | Build tool e dev server |
| **TypeScript** | Tipagem estática |
| **React Router** | Roteamento SPA |
| **TanStack Query (React Query)** | Cache, fetching e sincronização com API |
| **Axios** | Cliente HTTP |
| **Zustand** | Estado global leve (auth, tenant, UI) |
| **React Hook Form + Zod** | Formulários e validação |
| **Tailwind CSS** | Estilização utility-first |
| **shadcn/ui** | Componentes acessíveis e customizáveis |
| **Recharts** | Gráficos da dashboard |
| **date-fns** | Manipulação de datas |

---

## 2) Arquitetura — Feature-Based (Modular)

O frontend segue uma arquitetura **modular por feature**, onde cada domínio do sistema é uma pasta autocontida com seus componentes, hooks, services e tipos.

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx
│   ├── routes.tsx          # Definição de rotas
│   └── providers.tsx       # Providers globais (QueryClient, Auth, Theme)
│
├── features/               # Módulos por domínio
│   ├── auth/
│   │   ├── components/     # LoginForm, RegisterForm, InviteAccept
│   │   ├── hooks/          # useAuth, useLogin, useRegister
│   │   ├── services/       # authService.ts (chamadas API)
│   │   ├── types/          # auth.types.ts
│   │   ├── schemas/        # validações Zod
│   │   └── pages/          # LoginPage, RegisterPage
│   │
│   ├── dashboard/
│   │   ├── components/     # SummaryCards, Charts, QuickActions
│   │   ├── hooks/          # useDashboardData, useMonthSummary
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/          # DashboardPage
│   │
│   ├── transactions/
│   │   ├── components/     # TransactionList, TransactionForm, TransactionFilters
│   │   ├── hooks/          # useTransactions, useCreateTransaction
│   │   ├── services/
│   │   ├── types/
│   │   ├── schemas/
│   │   └── pages/          # TransactionsPage (extrato)
│   │
│   ├── recurring/
│   │   ├── components/     # RecurringList, RecurringForm
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── accounts/
│   │   ├── components/     # AccountList, AccountForm
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── categories/
│   │   ├── components/     # CategoryList, CategoryForm
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   └── settings/
│       ├── components/     # ProfileForm, WorkspaceSettings, MemberManagement
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── pages/
│
├── shared/                 # Código reutilizável entre features
│   ├── components/         # Button, Modal, Drawer, DataTable, EmptyState
│   │   └── ui/             # Componentes shadcn/ui customizados
│   ├── hooks/              # useDebounce, useMediaQuery, useCurrency
│   ├── lib/                # api.ts (instância Axios), formatters, constants
│   ├── types/              # tipos globais (ApiResponse, Pagination, etc)
│   └── utils/              # helpers puros (formatCurrency, formatDate)
│
├── styles/
│   └── globals.css         # Tailwind base + tokens customizados
│
└── main.tsx                # Entry point
```

### Regras da arquitetura

1. **Features não importam de outras features.** Se duas features precisam do mesmo código, ele vai para `shared/`.
2. **Pages são composições.** Uma page monta componentes da feature e do shared, sem lógica de negócio inline.
3. **Hooks encapsulam lógica.** Toda chamada API e estado derivado fica em hooks customizados.
4. **Services são a camada de API.** Cada feature tem seu service que usa a instância Axios do `shared/lib/api.ts`.
5. **Types e schemas colocados na feature.** Tipos compartilhados entre features vão para `shared/types`.

---

## 3) Princípios e práticas

### SOLID adaptado para React

| Princípio | Aplicação no React |
|-----------|-------------------|
| **S — Single Responsibility** | Cada componente faz uma coisa. `TransactionForm` não busca dados, apenas renderiza o formulário. O hook `useCreateTransaction` cuida da lógica. |
| **O — Open/Closed** | Componentes extensíveis via props e composição, não por modificação. Um `<DataTable>` genérico recebe colunas e dados via props. |
| **L — Liskov Substitution** | Componentes que implementam a mesma interface (ex: variantes de botão) devem ser intercambiáveis. |
| **I — Interface Segregation** | Props tipadas e específicas. Não passar um objeto `transaction` inteiro se o componente só precisa de `amount` e `date`. |
| **D — Dependency Inversion** | Componentes dependem de abstrações (hooks/interfaces), não de implementações concretas. O componente não chama `axios.get()` diretamente. |

### Clean Code

* Nomes descritivos e em inglês para código, português para textos exibidos ao usuário
* Funções pequenas e com propósito único
* Sem magic numbers — usar constantes nomeadas
* Sem lógica condicional complexa em JSX — extrair para variáveis ou componentes
* Evitar `any` no TypeScript — tipar tudo
* Sem `console.log` em produção

### Padrões do projeto

* **Custom Hooks** para encapsular toda lógica de estado e side effects
* **Composição** sobre herança (React já favorece isso)
* **Container/Presentational** quando fizer sentido: hook faz a lógica, componente renderiza
* **Colocation**: manter arquivos relacionados juntos (componente + hook + types na mesma feature)

---

## 4) Estado da aplicação

### Zustand (estado global)

Usar apenas para estado que precisa ser acessível em qualquer lugar:

* **Auth store**: usuário logado, token, tenant ativo
* **UI store**: sidebar aberta/fechada, tema, modais globais

### TanStack Query (estado do servidor)

Toda comunicação com a API usa React Query:

* Cache automático e invalidação
* Loading/error states prontos
* Refetch em background
* Otimistic updates para ações rápidas (ex: marcar conta como paga)

### React Hook Form (estado de formulários)

* Validação com Zod schemas
* Performance otimizada (sem re-renders desnecessários)
* Integração com componentes shadcn/ui

**Regra**: se o dado vem da API → React Query. Se é estado de UI global → Zustand. Se é formulário → React Hook Form. Estado local do componente → `useState`.

---

## 5) Roteamento

```
/login
/register
/invite/:token

/ (redirect para /dashboard)
/dashboard
/transactions
/recurring
/accounts
/categories
/settings
/settings/profile
/settings/workspace
/settings/members
```

### Proteção de rotas

* Rotas autenticadas protegidas por um `<AuthGuard>` que verifica token e tenant
* Rotas públicas: login, register, aceite de convite
* Redirect automático para login quando token expira

---

## 6) Comunicação com API

### Instância Axios centralizada

```typescript
// shared/lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: injeta token e tenant_id em toda request
// Interceptor: trata 401 → redirect para login
```

### Padrão de service por feature

```typescript
// features/transactions/services/transactionService.ts
export const transactionService = {
  list: (filters: TransactionFilters) => api.get<Transaction[]>('/transactions', { params: filters }),
  create: (data: CreateTransactionDTO) => api.post<Transaction>('/transactions', data),
  update: (id: string, data: UpdateTransactionDTO) => api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};
```

### Padrão de hook por operação

```typescript
// features/transactions/hooks/useTransactions.ts
export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.list(filters),
  });
}
```

---

## 7) Tratamento de erros

* **API errors**: interceptor global do Axios trata 401 (redirect login) e 403 (sem permissão)
* **Validation errors**: Zod + React Hook Form mostram erros inline nos campos
* **Network errors**: React Query mostra estado de erro com opção de retry
* **Error Boundary**: componente React que captura erros de renderização e mostra fallback

---

## 8) Responsividade

* Mobile-first com Tailwind CSS
* Dashboard reorganiza cards em grid responsivo
* Modais viram drawers full-screen em mobile
* Menu lateral colapsável com hamburger em mobile
* Tabelas com scroll horizontal ou layout card em telas pequenas

---

## 9) Deploy — Hostinger Compartilhada

O frontend React com Vite gera arquivos estáticos (`dist/`). Na Hostinger compartilhada:

* Build local ou via CI: `npm run build`
* Upload da pasta `dist/` para o `public_html` (ou subdiretório)
* Configurar `.htaccess` para SPA routing (redirecionar tudo para `index.html`)

```apache
# .htaccess para SPA React
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Variáveis de ambiente

* `.env.production` com `VITE_API_URL` apontando para o backend na Hostinger
* Nunca commitar secrets no repositório

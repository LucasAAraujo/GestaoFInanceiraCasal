# Passo a Passo — Do Início ao Deploy

Cada passo é uma unidade de trabalho que será **commitada individualmente**.
O formato do commit segue o padrão: `tipo(escopo): descrição`

---

## FASE 0 — Setup do Projeto

### Passo 0.1 — Inicializar repositório e estrutura base

```
O que fazer:
  - git init
  - Criar .gitignore (node_modules, dist, .env, .env.*, *.log)
  - Criar README.md com nome do projeto e descrição curta
  - Criar estrutura de pastas: /frontend, /backend, /docs
  - Mover os .md de docs para /docs

Commit: chore: inicializar repositório e estrutura de pastas
```

### Passo 0.2 — Setup do backend (NestJS)

```
O que fazer:
  - cd backend
  - nest new . (ou npx @nestjs/cli new backend)
  - Instalar dependências base:
    - @nestjs/config
    - helmet
    - cors (já vem no NestJS)
  - Configurar main.ts com:
    - helmet()
    - enableCors() apontando para localhost:5173 (Vite dev)
    - ValidationPipe global
    - prefixo /api
  - Criar .env e .env.example
  - Testar: npm run start:dev → localhost:3000/api respondendo

Commit: chore(backend): setup inicial NestJS com helmet, cors e validation pipe
```

### Passo 0.3 — Setup do Prisma + MySQL

```
O que fazer:
  - npm install prisma @prisma/client
  - npx prisma init (gera prisma/schema.prisma)
  - Configurar datasource para MySQL no schema.prisma
  - Configurar DATABASE_URL no .env (MySQL local)
  - Criar o banco local no MySQL: CREATE DATABASE gestao_casal;
  - Testar conexão: npx prisma db push (schema vazio, mas conecta)
  - Criar prisma.module.ts e prisma.service.ts no backend

Commit: chore(backend): configurar Prisma com MySQL e módulo PrismaService
```

### Passo 0.4 — Setup do frontend (React + Vite)

```
O que fazer:
  - npm create vite@latest frontend -- --template react-ts
  - cd frontend
  - Instalar dependências base:
    - tailwindcss @tailwindcss/vite
    - axios
  - Configurar Tailwind (CSS import)
  - Configurar vite.config.ts com proxy para /api → localhost:3000
  - Criar .env com VITE_API_URL=http://localhost:3000/api
  - Limpar boilerplate do Vite (App.tsx, remover assets desnecessários)
  - Criar estrutura de pastas: /src/features, /src/shared, /src/app
  - Testar: npm run dev → localhost:5173 rodando

Commit: chore(frontend): setup React + Vite + TypeScript + Tailwind
```

### Passo 0.5 — Instalar e configurar shadcn/ui

```
O que fazer:
  - npx shadcn@latest init (configurar com Tailwind)
  - Adicionar componentes base: Button, Input, Label, Card, Dialog, Sheet
  - Criar layout base: shared/components/ui/
  - Testar renderizando um Button na tela

Commit: chore(frontend): configurar shadcn/ui com componentes base
```

### Passo 0.6 — Configurar React Router + layout base

```
O que fazer:
  - npm install react-router-dom
  - Criar app/routes.tsx com rotas iniciais:
    - /login (placeholder)
    - /register (placeholder)
    - /dashboard (placeholder)
  - Criar app/providers.tsx (BrowserRouter)
  - Criar layout base:
    - shared/components/layout/AuthLayout.tsx (páginas públicas)
    - shared/components/layout/AppLayout.tsx (páginas autenticadas, com sidebar)
  - Atualizar App.tsx para usar providers e routes

Commit: chore(frontend): configurar React Router e layouts base
```

---

## FASE 1 — Autenticação

### Passo 1.1 — Schema de User e migration

```
O que fazer:
  - Definir model User no schema.prisma:
    - id, name, email (unique), password, avatarUrl, createdAt, updatedAt
  - Rodar: npx prisma migrate dev --name create_users_table
  - Verificar que a tabela foi criada no MySQL

Commit: feat(backend): criar schema e migration da tabela users
```

### Passo 1.2 — Módulo de auth no backend (register)

```
O que fazer:
  - nest g module modules/auth
  - nest g controller modules/auth
  - nest g service modules/auth
  - Instalar: bcrypt, @types/bcrypt
  - Criar dto/register.dto.ts com validações (name, email, password)
  - Instalar: class-validator, class-transformer
  - Implementar AuthService.register():
    - Verificar se email já existe
    - Hash da senha com bcrypt
    - Criar user no banco
    - Retornar user sem senha
  - Criar users.repository.ts para encapsular queries Prisma
  - Endpoint: POST /api/auth/register
  - Testar com Postman/Insomnia

Commit: feat(backend): implementar registro de usuário com bcrypt
```

### Passo 1.3 — Login com JWT

```
O que fazer:
  - Instalar: @nestjs/jwt, @nestjs/passport, passport, passport-jwt, @types/passport-jwt
  - Configurar JwtModule no auth.module.ts (secret via env, expiração 1h)
  - Criar jwt.strategy.ts (valida token e retorna user)
  - Criar dto/login.dto.ts
  - Implementar AuthService.login():
    - Buscar user por email
    - Comparar senha com bcrypt
    - Gerar accessToken e refreshToken
    - Retornar tokens
  - Criar model RefreshToken no schema.prisma
  - Migration: npx prisma migrate dev --name create_refresh_tokens_table
  - Endpoint: POST /api/auth/login
  - Endpoint: POST /api/auth/refresh
  - Testar com Postman

Commit: feat(backend): implementar login com JWT e refresh token
```

### Passo 1.4 — Guards e decorators de autenticação

```
O que fazer:
  - Criar common/guards/jwt-auth.guard.ts
  - Criar common/decorators/current-user.decorator.ts (@CurrentUser)
  - Criar endpoint protegido de teste: GET /api/users/me
  - Criar users.module.ts, users.controller.ts, users.service.ts
  - Testar: request sem token → 401, com token → retorna user

Commit: feat(backend): criar guard JWT e decorator @CurrentUser
```

### Passo 1.5 — Tela de registro no frontend

```
O que fazer:
  - Instalar: react-hook-form, @hookform/resolvers, zod
  - Criar features/auth/schemas/register.schema.ts (Zod)
  - Criar features/auth/services/authService.ts (chamadas API)
  - Criar features/auth/components/RegisterForm.tsx
    - Campos: nome, email, senha, confirmar senha
    - Validação com Zod
    - Feedback de erro/sucesso
  - Criar features/auth/pages/RegisterPage.tsx
  - Conectar na rota /register
  - Testar: preencher formulário → criar user → ver resposta

Commit: feat(frontend): implementar tela de registro com validação
```

### Passo 1.6 — Tela de login no frontend

```
O que fazer:
  - Criar features/auth/schemas/login.schema.ts
  - Criar features/auth/components/LoginForm.tsx
  - Criar features/auth/pages/LoginPage.tsx
  - Instalar: zustand
  - Criar shared/stores/authStore.ts (Zustand):
    - user, token, isAuthenticated
    - login(), logout(), setUser()
  - Configurar shared/lib/api.ts (instância Axios):
    - Interceptor: injetar token no header Authorization
    - Interceptor: 401 → limpar store e redirect para /login
  - Criar features/auth/hooks/useAuth.ts
  - Salvar token no localStorage
  - Após login: redirect para /dashboard
  - Testar: login → token salvo → redirect → refresh mantém sessão

Commit: feat(frontend): implementar tela de login e auth store com Zustand
```

### Passo 1.7 — Proteção de rotas no frontend

```
O que fazer:
  - Criar shared/components/guards/AuthGuard.tsx
    - Verifica se há token válido
    - Se não: redirect para /login
    - Se sim: renderiza children
  - Envolver rotas autenticadas com AuthGuard
  - Criar rota / com redirect para /dashboard
  - Testar: acessar /dashboard sem token → vai para /login

Commit: feat(frontend): implementar proteção de rotas com AuthGuard
```

### Passo 1.8 — Recuperação de senha

```
O que fazer:
  Backend:
    - Instalar: nodemailer, @types/nodemailer
    - Criar modules/mail/mail.module.ts e mail.service.ts
    - Criar dto/forgot-password.dto.ts e reset-password.dto.ts
    - Implementar AuthService.forgotPassword():
      - Gerar token de reset (UUID + expiração 1h)
      - Salvar token no banco (nova coluna ou tabela)
      - Enviar email com link de reset
    - Implementar AuthService.resetPassword():
      - Validar token e expiração
      - Hash da nova senha
      - Atualizar senha do user
    - Endpoints: POST /api/auth/forgot-password e POST /api/auth/reset-password
  Frontend:
    - Criar ForgotPasswordPage.tsx (campo email)
    - Criar ResetPasswordPage.tsx (nova senha + confirmar)
    - Rotas: /forgot-password e /reset-password/:token

Commit: feat: implementar fluxo de recuperação de senha com envio de e-mail
```

---

## FASE 2 — Tenant (Workspace do Casal)

### Passo 2.1 — Schema de Tenant e TenantMember

```
O que fazer:
  - Adicionar models no schema.prisma:
    - Tenant (id, name, createdAt, updatedAt)
    - TenantMember (id, tenantId, userId, role, color, joinedAt, invitedBy)
    - Invitation (id, tenantId, email, token, invitedBy, status, expiresAt)
  - Migration: npx prisma migrate dev --name create_tenant_tables

Commit: feat(backend): criar schema e migration de Tenant, TenantMember e Invitation
```

### Passo 2.2 — CRUD de Tenant no backend

```
O que fazer:
  - Criar modules/tenant (module, controller, service, repository)
  - Implementar TenantService.create():
    - Criar tenant
    - Criar TenantMember vinculando o user como "admin"
    - Retornar tenant criado
  - Implementar TenantService.getMyTenant()
  - Atualizar JWT payload para incluir tenantId
  - Atualizar jwt.strategy para carregar tenant do user
  - Endpoints:
    - POST /api/tenants (criar workspace)
    - GET /api/tenants/me (dados do tenant atual)
  - Testar: criar tenant → ver que user foi vinculado como admin

Commit: feat(backend): implementar criação de tenant e vínculo de membro admin
```

### Passo 2.3 — Convite do parceiro(a)

```
O que fazer:
  Backend:
    - Implementar TenantService.invite():
      - Validar que o tenant tem menos de 2 membros
      - Criar registro na tabela invitations (token UUID, expiração 7 dias)
      - Enviar email com link de convite
    - Implementar TenantService.acceptInvite():
      - Validar token e expiração
      - Se user não existe: criar conta (ou exigir registro antes)
      - Criar TenantMember vinculando ao tenant
      - Marcar invitation como "accepted"
      - Atualizar JWT com tenantId
    - Endpoints:
      - POST /api/tenants/invite
      - POST /api/tenants/accept-invite
  Frontend:
    - Criar página /invite/:token (aceite de convite)
    - Se logado: aceitar direto
    - Se não logado: registrar e depois aceitar

Commit: feat: implementar convite do parceiro(a) com aceite por e-mail
```

### Passo 2.4 — Middleware e guard de tenant

```
O que fazer:
  - Criar common/middlewares/tenant-context.middleware.ts
    - Extrai tenantId do JWT e coloca no request
  - Criar common/guards/tenant.guard.ts
    - Verifica se o user é membro do tenant
    - Retorna 403 se não for
  - Criar common/decorators/current-tenant.decorator.ts (@CurrentTenant)
  - Aplicar middleware e guard globalmente nas rotas autenticadas
  - Testar: request com token de tenant A tentando acessar tenant B → 403

Commit: feat(backend): implementar middleware e guard de tenant isolation
```

### Passo 2.5 — Tela de criação do workspace no frontend

```
O que fazer:
  - Criar features/tenant/pages/CreateWorkspacePage.tsx
    - Campo: nome do espaço do casal
    - Botão: criar workspace
  - Criar features/tenant/services/tenantService.ts
  - Fluxo pós-registro:
    - Se user não tem tenant → redirect para /create-workspace
    - Se user tem tenant → redirect para /dashboard
  - Atualizar authStore para guardar tenantId
  - Criar tela de convite (features/tenant/components/InviteMemberForm.tsx)
  - Rota /create-workspace

Commit: feat(frontend): implementar criação de workspace e fluxo de onboarding
```

---

## FASE 3 — Contas e Categorias

### Passo 3.1 — Schema de Account e Category

```
O que fazer:
  - Adicionar models no schema.prisma:
    - Account (id, tenantId, name, type, ownerUserId, initialBalance, isActive)
    - Category (id, tenantId, name, type, color, icon, isDefault, isArchived)
  - Migration: npx prisma migrate dev --name create_accounts_and_categories

Commit: feat(backend): criar schema e migration de Account e Category
```

### Passo 3.2 — CRUD de categorias no backend

```
O que fazer:
  - Criar modules/categories (module, controller, service, repository)
  - Implementar:
    - list(tenantId) — listar categorias do tenant (excluir arquivadas)
    - create(tenantId, dto) — criar categoria
    - update(tenantId, id, dto) — atualizar
    - archive(tenantId, id) — arquivar (soft delete)
  - DTOs com validação
  - Todos os métodos do repository filtram por tenantId
  - Endpoints: GET, POST, PATCH, DELETE /api/categories
  - Testar com Postman

Commit: feat(backend): implementar CRUD de categorias com tenant isolation
```

### Passo 3.3 — Seed de categorias default no onboarding

```
O que fazer:
  - Criar lógica de seed no TenantService.create():
    - Após criar tenant, criar categorias default automaticamente
    - Despesas: Moradia, Alimentação, Transporte, Saúde, Lazer, Assinaturas, Pets, Educação
    - Receitas: Salário, Freelance, Reembolso, Rendimentos, Outros
    - Marcar como is_default: true
  - Extrair lista de categorias para um arquivo de constantes
  - Testar: criar novo tenant → verificar que categorias foram criadas

Commit: feat(backend): criar categorias default automaticamente no onboarding
```

### Passo 3.4 — CRUD de contas no backend

```
O que fazer:
  - Criar modules/accounts (module, controller, service, repository)
  - Implementar:
    - list(tenantId)
    - create(tenantId, dto)
    - update(tenantId, id, dto)
    - deactivate(tenantId, id) — soft delete via isActive
  - DTOs: name, type (checking/savings/credit_card/wallet), ownerUserId, initialBalance
  - Endpoints: GET, POST, PATCH, DELETE /api/accounts
  - Testar com Postman

Commit: feat(backend): implementar CRUD de contas com tenant isolation
```

### Passo 3.5 — Tela de categorias no frontend

```
O que fazer:
  - Instalar: @tanstack/react-query
  - Configurar QueryClientProvider no app/providers.tsx
  - Criar features/categories/services/categoryService.ts
  - Criar features/categories/hooks/useCategories.ts (React Query)
  - Criar features/categories/components/:
    - CategoryList.tsx (lista com cor e ícone)
    - CategoryForm.tsx (modal de criação/edição)
  - Criar features/categories/pages/CategoriesPage.tsx
  - Rota: /categories
  - Testar: listar, criar, editar, arquivar categoria

Commit: feat(frontend): implementar tela de gestão de categorias
```

### Passo 3.6 — Tela de contas no frontend

```
O que fazer:
  - Criar features/accounts/services/accountService.ts
  - Criar features/accounts/hooks/useAccounts.ts
  - Criar features/accounts/components/:
    - AccountList.tsx (cards com saldo)
    - AccountForm.tsx (modal de criação/edição)
  - Criar features/accounts/pages/AccountsPage.tsx
  - Rota: /accounts
  - Testar: listar, criar, editar, desativar conta

Commit: feat(frontend): implementar tela de gestão de contas
```

---

## FASE 4 — Transações (Core Financeiro)

### Passo 4.1 — Schema de Transaction

```
O que fazer:
  - Adicionar model Transaction no schema.prisma
    - Todos os campos definidos no banco-de-dados.md
    - Índices compostos com tenant_id
  - Migration: npx prisma migrate dev --name create_transactions

Commit: feat(backend): criar schema e migration de transactions com índices
```

### Passo 4.2 — CRUD de transações no backend

```
O que fazer:
  - Criar modules/transactions (module, controller, service, repository)
  - DTOs:
    - CreateTransactionDTO (type, amount, description, date, categoryId, accountId, ownerUserId, beneficiaryScope)
    - UpdateTransactionDTO (partial)
    - TransactionFiltersDTO (period, categoryId, type, status, accountId, ownerUserId, search)
  - Implementar:
    - list(tenantId, filters) — com paginação e filtros
    - create(tenantId, dto) — validar que category e account pertencem ao tenant
    - update(tenantId, id, dto)
    - delete(tenantId, id)
  - Regra: transferência cria 2 registros (saída + entrada) em $transaction
  - Endpoints: GET, POST, PATCH, DELETE /api/transactions
  - Testar todos os tipos: receita, despesa, transferência

Commit: feat(backend): implementar CRUD de transações com filtros e paginação
```

### Passo 4.3 — Formulário de transação no frontend

```
O que fazer:
  - Criar features/transactions/schemas/transaction.schema.ts
  - Criar features/transactions/services/transactionService.ts
  - Criar features/transactions/components/:
    - TransactionForm.tsx (modal/drawer)
      - Tipo: receita/despesa/transferência (tabs ou select)
      - Campos: valor, descrição, data, categoria, conta, escopo, quem pagou
      - Categorias filtradas por tipo selecionado
      - Validação com Zod
  - Criar features/transactions/hooks/:
    - useCreateTransaction.ts
    - useUpdateTransaction.ts
  - Testar: criar receita, despesa e transferência via modal

Commit: feat(frontend): implementar formulário de criação de transação
```

### Passo 4.4 — Extrato (listagem de transações) no frontend

```
O que fazer:
  - Criar features/transactions/hooks/useTransactions.ts (React Query com filtros)
  - Criar features/transactions/components/:
    - TransactionList.tsx (lista com avatar do membro, badge individual/shared)
    - TransactionFilters.tsx (período, categoria, tipo, pessoa, busca)
    - TransactionItem.tsx (linha do extrato)
  - Criar features/transactions/pages/TransactionsPage.tsx
  - Implementar paginação (load more ou infinite scroll)
  - Rota: /transactions
  - Testar: listar, filtrar por categoria, por pessoa, por período

Commit: feat(frontend): implementar extrato com filtros e paginação
```

---

## FASE 5 — Gastos Recorrentes

### Passo 5.1 — Schema de RecurringTransaction

```
O que fazer:
  - Adicionar model RecurringTransaction no schema.prisma
  - Adicionar campo recurringId na Transaction (FK opcional)
  - Migration: npx prisma migrate dev --name create_recurring_transactions

Commit: feat(backend): criar schema e migration de recurring_transactions
```

### Passo 5.2 — CRUD de recorrências no backend

```
O que fazer:
  - Criar modules/recurring (module, controller, service, repository)
  - Implementar:
    - list(tenantId) — listar recorrências ativas
    - create(tenantId, dto)
    - update(tenantId, id, dto, scope) — scope: "this" | "future" | "all"
    - deactivate(tenantId, id) — encerrar recorrência
  - Implementar generateOccurrences(tenantId):
    - Buscar recorrências ativas com nextDueDate <= hoje
    - Criar Transaction para cada ocorrência devida
    - Atualizar nextDueDate para a próxima data
  - Endpoints: GET, POST, PATCH, DELETE /api/recurring
  - Endpoint: POST /api/recurring/generate (pode ser chamado por cron ou no login)
  - Testar: criar recorrência → gerar ocorrências → verificar transações criadas

Commit: feat(backend): implementar CRUD de recorrências e geração de ocorrências
```

### Passo 5.3 — Tela de recorrências no frontend

```
O que fazer:
  - Criar features/recurring/services/recurringService.ts
  - Criar features/recurring/hooks/useRecurring.ts
  - Criar features/recurring/components/:
    - RecurringList.tsx (lista com status ativo/pausado, próxima cobrança)
    - RecurringForm.tsx (modal: descrição, valor, categoria, conta, frequência, data início)
  - Criar features/recurring/pages/RecurringPage.tsx
  - Rota: /recurring
  - Testar: criar, editar, pausar, encerrar recorrência

Commit: feat(frontend): implementar tela de gestão de recorrências
```

---

## FASE 6 — Dashboard

### Passo 6.1 — Endpoints de dashboard no backend

```
O que fazer:
  - Criar modules/dashboard (module, controller, service, repository)
  - Implementar DashboardService.getSummary(tenantId, month, year):
    - Receita total do mês
    - Despesa total do mês
    - Saldo do mês (receita - despesa)
    - Total de gastos recorrentes do mês
    - Percentual comprometido da renda
    - Economia do mês
  - Implementar DashboardService.getCharts(tenantId, month, year):
    - Receitas x despesas por mês (últimos 6 meses)
    - Gastos por categoria (mês atual)
    - Divisão por pessoa (mês atual)
  - Implementar DashboardService.getUpcoming(tenantId):
    - Próximas contas a vencer (7/15/30 dias)
  - Endpoints:
    - GET /api/dashboard/summary?month=6&year=2026
    - GET /api/dashboard/charts?month=6&year=2026
    - GET /api/dashboard/upcoming
  - Testar com dados reais no banco

Commit: feat(backend): implementar endpoints de dashboard com métricas e gráficos
```

### Passo 6.2 — Dashboard no frontend (cards e resumo)

```
O que fazer:
  - Criar features/dashboard/services/dashboardService.ts
  - Criar features/dashboard/hooks/useDashboardData.ts
  - Criar features/dashboard/components/:
    - SummaryCards.tsx (receita, despesa, saldo, recorrentes, % comprometido)
    - MonthSelector.tsx (navegação entre meses)
  - Criar features/dashboard/pages/DashboardPage.tsx
  - Estilizar cards com cores e ícones (shadcn + Tailwind)
  - Rota: /dashboard (já existente, conectar ao componente)
  - Testar: visualizar dados do mês, navegar entre meses

Commit: feat(frontend): implementar cards de resumo na dashboard
```

### Passo 6.3 — Dashboard: gráficos

```
O que fazer:
  - Instalar: recharts
  - Criar features/dashboard/components/:
    - RevenueExpenseChart.tsx (barras: receita x despesa últimos 6 meses)
    - CategoryChart.tsx (pizza/donut: gastos por categoria)
    - PersonSplitChart.tsx (barras horizontais: divisão por pessoa)
  - Adicionar gráficos na DashboardPage
  - Responsivo: em mobile, gráficos empilham verticalmente
  - Testar: visualizar gráficos com dados reais

Commit: feat(frontend): implementar gráficos da dashboard com Recharts
```

### Passo 6.4 — Dashboard: ações rápidas e contas a vencer

```
O que fazer:
  - Criar features/dashboard/components/:
    - QuickActions.tsx (botões: + Receita, + Despesa, + Transferência)
      - Cada botão abre o TransactionForm em modal
    - UpcomingBills.tsx (lista de próximas contas a vencer)
  - Adicionar na DashboardPage
  - Testar: criar transação via quick action, ver contas a vencer

Commit: feat(frontend): implementar ações rápidas e contas a vencer na dashboard
```

---

## FASE 7 — Perfil e Configurações

### Passo 7.1 — Tela de perfil do usuário

```
O que fazer:
  Backend:
    - Implementar PATCH /api/users/me (name, avatarUrl)
  Frontend:
    - Criar features/settings/pages/ProfilePage.tsx
      - Editar nome
      - Visualizar email (não editável)
      - Alterar senha (senha atual + nova senha)
    - Rota: /settings/profile

Commit: feat: implementar tela de perfil do usuário
```

### Passo 7.2 — Tela de configurações do workspace

```
O que fazer:
  Backend:
    - Implementar PATCH /api/tenants/me (name)
    - Implementar GET /api/tenants/me/members (listar membros)
  Frontend:
    - Criar features/settings/pages/WorkspacePage.tsx
      - Nome do workspace
      - Lista de membros (nome, email, cor, role)
      - Botão de convidar (se < 2 membros)
    - Criar features/settings/pages/MembersPage.tsx
    - Rotas: /settings/workspace, /settings/members

Commit: feat: implementar configurações do workspace e gestão de membros
```

---

## FASE 8 — Refinamento e Polish

### Passo 8.1 — Sidebar e navegação final

```
O que fazer:
  - Criar shared/components/layout/Sidebar.tsx:
    - Logo/nome do casal
    - Links: Dashboard, Extrato, Recorrências, Contas, Categorias
    - Configurações (bottom)
    - Avatar do user logado
    - Colapsável em mobile (hamburger)
  - Criar shared/components/layout/Header.tsx:
    - Seletor de mês (global)
    - Quick action principal (+ Nova transação)
    - Avatar e dropdown do user
  - Atualizar AppLayout.tsx com sidebar + header
  - Testar em desktop e mobile

Commit: feat(frontend): implementar sidebar, header e navegação completa
```

### Passo 8.2 — Loading states e empty states

```
O que fazer:
  - Criar shared/components/LoadingSpinner.tsx
  - Criar shared/components/EmptyState.tsx (ícone + mensagem + ação)
  - Adicionar skeletons nos cards da dashboard
  - Adicionar empty states em todas as listagens:
    - "Nenhuma transação encontrada"
    - "Nenhuma categoria criada"
    - "Nenhuma conta cadastrada"
  - Adicionar loading states em todas as páginas

Commit: feat(frontend): adicionar loading states e empty states
```

### Passo 8.3 — Toasts e feedback ao usuário

```
O que fazer:
  - Instalar: sonner (ou react-hot-toast)
  - Configurar Toaster no providers.tsx
  - Adicionar toasts em todas as operações:
    - Sucesso: "Transação criada com sucesso"
    - Erro: "Erro ao criar transação. Tente novamente."
    - Aviso: "Categoria arquivada"
  - Adicionar confirmação antes de deletar (Dialog de confirmação)

Commit: feat(frontend): implementar sistema de toasts e confirmações
```

### Passo 8.4 — Tratamento global de erros

```
O que fazer:
  Backend:
    - Criar common/filters/http-exception.filter.ts
    - Padronizar responses de erro (statusCode, error, message, details)
    - Registrar como filtro global
  Frontend:
    - Criar shared/components/ErrorBoundary.tsx
    - Tratar erros de rede no interceptor do Axios
    - Mostrar página de erro genérica para crashes

Commit: feat: implementar tratamento global de erros no backend e frontend
```

### Passo 8.5 — Responsividade final

```
O que fazer:
  - Revisar todas as telas em breakpoints: 320px, 375px, 768px, 1024px, 1440px
  - Dashboard: cards em grid responsivo (1 col mobile → 2 col tablet → 4 col desktop)
  - Extrato: tabela vira cards em mobile
  - Modais: full-screen em mobile, centered em desktop
  - Gráficos: redimensionam corretamente
  - Sidebar: drawer em mobile, fixa em desktop
  - Corrigir qualquer overflow ou quebra de layout

Commit: fix(frontend): ajustes de responsividade em todas as telas
```

---

## FASE 9 — Testes

### Passo 9.1 — Testes unitários do backend

```
O que fazer:
  - Configurar Jest (já vem com NestJS)
  - Escrever testes para os services principais:
    - AuthService: register, login, refresh
    - TransactionService: create, list com filtros, regra de transferência
    - RecurringService: gerar ocorrências
    - DashboardService: cálculo de métricas
  - Mockar repositories (não bater no banco)
  - Rodar: npm run test
  - Garantir cobertura dos fluxos críticos

Commit: test(backend): adicionar testes unitários dos services principais
```

### Passo 9.2 — Testes e2e do backend

```
O que fazer:
  - Configurar banco de teste (DATABASE_URL_TEST)
  - Escrever testes e2e para os fluxos principais:
    - Registro → login → criar tenant → convidar → aceitar
    - CRUD completo de transações
    - Tenant isolation (user A não acessa dados do tenant B)
  - Rodar: npm run test:e2e

Commit: test(backend): adicionar testes e2e dos fluxos principais
```

### Passo 9.3 — Testes do frontend

```
O que fazer:
  - Instalar: vitest, @testing-library/react, @testing-library/jest-dom
  - Configurar vitest no vite.config.ts
  - Escrever testes para componentes críticos:
    - TransactionForm: validação dos campos
    - AuthGuard: redirect quando não autenticado
    - SummaryCards: renderiza dados corretamente
  - Rodar: npm run test

Commit: test(frontend): adicionar testes dos componentes críticos
```

---

## FASE 10 — Preparação para Deploy

### Passo 10.1 — Variáveis de ambiente e segurança

```
O que fazer:
  - Revisar que nenhum secret está hardcoded
  - Criar .env.example no backend e frontend com todas as variáveis necessárias
  - Configurar CORS no backend para aceitar apenas o domínio de produção
  - Configurar rate limiting no backend (throttler do NestJS)
  - Revisar headers de segurança (helmet)
  - Garantir que .env está no .gitignore

Commit: chore: configurar variáveis de ambiente e segurança para produção
```

### Passo 10.2 — Build de produção

```
O que fazer:
  Frontend:
    - Configurar .env.production com VITE_API_URL do domínio da Hostinger
    - npm run build → gera dist/
    - Testar build localmente: npx serve dist
    - Criar .htaccess para SPA routing
  Backend:
    - npm run build → gera dist/
    - Verificar que main.js roda: node dist/main.js
    - Testar com NODE_ENV=production

Commit: chore: configurar build de produção frontend e backend
```

### Passo 10.3 — Deploy na Hostinger

```
O que fazer:
  1. Acessar painel da Hostinger
  2. Criar banco MySQL pelo painel:
     - Nome: gestao_casal
     - User e senha seguros
  3. Upload do backend:
     - Subir código para a Hostinger (Git deploy ou FTP)
     - Configurar Node.js pelo painel (entry point: dist/main.js)
     - Configurar variáveis de ambiente pelo painel
     - Rodar: npx prisma migrate deploy
     - Rodar: npx prisma db seed (categorias default para o primeiro tenant)
  4. Upload do frontend:
     - Subir dist/ para public_html (ou subdomínio)
     - Subir .htaccess junto
  5. Configurar domínio/subdomínio:
     - app.seudominio.com → frontend
     - api.seudominio.com → backend (ou seudominio.com/api)
  6. Testar em produção:
     - Registro
     - Login
     - Criar workspace
     - Convidar parceiro(a)
     - Criar transações
     - Dashboard com dados

Commit: chore: configurar deploy na Hostinger e documentar processo
```

### Passo 10.4 — Configurar e-mail da Hostinger

```
O que fazer:
  - Criar conta de e-mail no painel: noreply@seudominio.com
  - Configurar SMTP da Hostinger no .env do backend:
    - MAIL_HOST=smtp.hostinger.com
    - MAIL_PORT=465
    - MAIL_USER=noreply@seudominio.com
    - MAIL_PASS=<senha>
  - Testar envio de e-mail:
    - Convite do parceiro(a)
    - Recuperação de senha

Commit: chore: configurar envio de e-mail via SMTP da Hostinger
```

---

## FASE 11 — Pós-deploy

### Passo 11.1 — Smoke test em produção

```
O que fazer:
  - Testar todos os fluxos críticos em produção:
    [ ] Registro de novo usuário
    [ ] Login
    [ ] Criar workspace
    [ ] Convidar parceiro(a) (verificar e-mail)
    [ ] Aceitar convite
    [ ] Criar conta bancária
    [ ] Criar categoria customizada
    [ ] Criar receita
    [ ] Criar despesa
    [ ] Criar transferência
    [ ] Criar recorrência
    [ ] Ver dashboard com dados
    [ ] Filtrar extrato
    [ ] Editar perfil
    [ ] Recuperar senha
    [ ] Testar em mobile
  - Corrigir qualquer bug encontrado

Commit: fix: correções do smoke test em produção
```

### Passo 11.2 — README final para portfólio

```
O que fazer:
  - Atualizar README.md com:
    - Nome e descrição do projeto
    - Screenshots da dashboard e telas principais
    - Stack utilizada (com badges)
    - Arquitetura (diagrama simplificado)
    - Como rodar localmente (backend + frontend)
    - Features implementadas
    - Link para o sistema em produção
  - Preparar post para LinkedIn

Commit: docs: atualizar README com screenshots e documentação para portfólio
```

---

## Resumo de commits por fase

| Fase | Commits | Descrição |
|------|---------|-----------|
| 0 | 6 | Setup do projeto (repo, backend, prisma, frontend, shadcn, router) |
| 1 | 8 | Autenticação completa (register, login, JWT, guards, telas, recuperação) |
| 2 | 5 | Tenant / workspace do casal (schema, CRUD, convite, guards, tela) |
| 3 | 6 | Contas e categorias (schema, CRUD backend, seed, telas frontend) |
| 4 | 4 | Transações (schema, CRUD, formulário, extrato) |
| 5 | 3 | Recorrências (schema, CRUD, tela) |
| 6 | 4 | Dashboard (endpoints, cards, gráficos, quick actions) |
| 7 | 2 | Perfil e configurações |
| 8 | 5 | Refinamento (sidebar, loading, toasts, erros, responsividade) |
| 9 | 3 | Testes (unit, e2e, frontend) |
| 10 | 4 | Deploy (env, build, Hostinger, e-mail) |
| 11 | 2 | Pós-deploy (smoke test, README) |
| **Total** | **52** | |

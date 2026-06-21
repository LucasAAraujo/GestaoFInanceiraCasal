# Banco de Dados — MySQL + Prisma

## 1) Stack

| Tecnologia | Função |
|------------|--------|
| **MySQL 8+** | Banco de dados relacional |
| **Prisma ORM** | Modelagem, migrations e queries tipadas |

---

## 2) Estratégia multi-tenant

**Single database + `tenant_id` em todas as tabelas de domínio.**

Toda tabela de negócio possui uma coluna `tenant_id` que referencia o tenant (casal).
Toda query no backend filtra obrigatoriamente por `tenant_id`.

### Tabelas SEM tenant_id (globais)

* `users` — dados de autenticação (um user pode pertencer a um tenant)

### Tabelas COM tenant_id

Todas as demais: `tenant_members`, `accounts`, `categories`, `transactions`, `recurring_transactions`

---

## 3) Convenções de nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Tabelas | `snake_case` plural | `transactions`, `recurring_transactions` |
| Colunas | `snake_case` | `tenant_id`, `created_at`, `paid_by_user_id` |
| PKs | `id` (UUID) | `id VARCHAR(36)` |
| FKs | `<entidade_singular>_id` | `category_id`, `account_id` |
| Indexes | `idx_<tabela>_<colunas>` | `idx_transactions_tenant_date` |
| Timestamps | `created_at`, `updated_at` | Presentes em todas as tabelas |
| Soft delete | `deleted_at` (nullable) | Quando aplicável |
| Booleanos | `is_<adjetivo>` | `is_active`, `is_default`, `is_archived` |

---

## 4) Diagrama de entidades (ERD)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │  tenant_members   │       │   tenants    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)      │
│ name         │  └───>│ user_id (FK)     │    │  │ name         │
│ email        │       │ tenant_id (FK)   │<───┘  │ created_at   │
│ password     │       │ role             │       │ updated_at   │
│ avatar_url   │       │ joined_at        │       └──────┬───────┘
│ created_at   │       │ invited_by       │              │
│ updated_at   │       └──────────────────┘              │
└──────────────┘                                         │
                                                         │ tenant_id
       ┌──────────────────────────────────┬──────────────┼──────────────────┐
       │                                  │              │                  │
       ▼                                  ▼              ▼                  ▼
┌──────────────┐       ┌──────────────────┐  ┌───────────────┐  ┌──────────────────────┐
│  accounts    │       │   categories     │  │ transactions  │  │ recurring_transactions│
├──────────────┤       ├──────────────────┤  ├───────────────┤  ├──────────────────────┤
│ id (PK)      │       │ id (PK)          │  │ id (PK)       │  │ id (PK)              │
│ tenant_id    │       │ tenant_id (FK)   │  │ tenant_id(FK) │  │ tenant_id (FK)       │
│ name         │       │ name             │  │ type          │  │ description          │
│ type         │       │ type             │  │ amount        │  │ amount               │
│ owner_user_id│       │ color            │  │ description   │  │ category_id (FK)     │
│ initial_bal  │       │ icon             │  │ date          │  │ account_id (FK)      │
│ is_active    │       │ is_default       │  │ category_id   │  │ frequency            │
│ created_at   │       │ is_archived      │  │ account_id    │  │ next_due_date        │
│ updated_at   │       │ created_at       │  │ owner_user_id │  │ is_active            │
└──────────────┘       │ updated_at       │  │ paid_by_uid   │  │ owner_user_id        │
                       └──────────────────┘  │ benef_scope   │  │ benef_scope          │
                                             │ status        │  │ start_date           │
                                             │ recurring_id  │  │ end_date             │
                                             │ notes         │  │ created_at           │
                                             │ created_at    │  │ updated_at           │
                                             │ updated_at    │  └──────────────────────┘
                                             └───────────────┘

┌──────────────────┐
│ invitations      │
├──────────────────┤
│ id (PK)          │
│ tenant_id (FK)   │
│ email            │
│ token            │
│ invited_by (FK)  │
│ status           │
│ expires_at       │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│ refresh_tokens   │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ token            │
│ expires_at       │
│ created_at       │
└──────────────────┘
```

---

## 5) Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ─── Autenticação e Tenant ──────────────────────────────

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  memberships   TenantMember[]
  refreshTokens RefreshToken[]

  @@map("users")
}

model Tenant {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  members      TenantMember[]
  accounts     Account[]
  categories   Category[]
  transactions Transaction[]
  recurring    RecurringTransaction[]
  invitations  Invitation[]

  @@map("tenants")
}

model TenantMember {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  userId    String   @map("user_id")
  role      String   @default("member") // "admin" | "member"
  color     String?  // cor do membro no dashboard
  joinedAt  DateTime @default(now()) @map("joined_at")
  invitedBy String?  @map("invited_by")

  tenant Tenant @relation(fields: [tenantId], references: [id])
  user   User   @relation(fields: [userId], references: [id])

  @@unique([tenantId, userId])
  @@map("tenant_members")
}

model Invitation {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  email     String
  token     String   @unique
  invitedBy String   @map("invited_by")
  status    String   @default("pending") // "pending" | "accepted" | "expired"
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@map("invitations")
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("refresh_tokens")
}

// ─── Domínio Financeiro ─────────────────────────────────

model Account {
  id             String   @id @default(uuid())
  tenantId       String   @map("tenant_id")
  name           String
  type           String   // "checking" | "savings" | "credit_card" | "wallet" | "investment"
  ownerUserId    String?  @map("owner_user_id") // null = conta conjunta
  initialBalance Decimal  @default(0) @map("initial_balance") @db.Decimal(12, 2)
  isActive       Boolean  @default(true) @map("is_active")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  tenant       Tenant        @relation(fields: [tenantId], references: [id])
  transactions Transaction[]
  recurring    RecurringTransaction[]

  @@index([tenantId], map: "idx_accounts_tenant")
  @@map("accounts")
}

model Category {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  name       String
  type       String   // "income" | "expense" | "investment" | "transfer"
  color      String   @default("#6B7280")
  icon       String?
  isDefault  Boolean  @default(false) @map("is_default")
  isArchived Boolean  @default(false) @map("is_archived")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  tenant       Tenant        @relation(fields: [tenantId], references: [id])
  transactions Transaction[]
  recurring    RecurringTransaction[]

  @@index([tenantId], map: "idx_categories_tenant")
  @@map("categories")
}

model Transaction {
  id               String   @id @default(uuid())
  tenantId         String   @map("tenant_id")
  type             String   // "income" | "expense" | "transfer"
  amount           Decimal  @db.Decimal(12, 2)
  description      String
  notes            String?  @db.Text
  date             DateTime @db.Date
  categoryId       String   @map("category_id")
  accountId        String   @map("account_id")
  ownerUserId      String?  @map("owner_user_id")
  paidByUserId     String?  @map("paid_by_user_id")
  beneficiaryScope String   @default("shared") @map("beneficiary_scope") // "individual" | "shared"
  status           String   @default("paid") // "pending" | "paid" | "cancelled"
  recurringId      String?  @map("recurring_id")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  tenant    Tenant                @relation(fields: [tenantId], references: [id])
  category  Category              @relation(fields: [categoryId], references: [id])
  account   Account               @relation(fields: [accountId], references: [id])
  recurring RecurringTransaction? @relation(fields: [recurringId], references: [id])

  @@index([tenantId, date], map: "idx_transactions_tenant_date")
  @@index([tenantId, categoryId], map: "idx_transactions_tenant_category")
  @@index([tenantId, type], map: "idx_transactions_tenant_type")
  @@index([tenantId, status], map: "idx_transactions_tenant_status")
  @@map("transactions")
}

model RecurringTransaction {
  id               String    @id @default(uuid())
  tenantId         String    @map("tenant_id")
  description      String
  amount           Decimal   @db.Decimal(12, 2)
  categoryId       String    @map("category_id")
  accountId        String    @map("account_id")
  frequency        String    // "weekly" | "monthly" | "yearly"
  nextDueDate      DateTime  @map("next_due_date") @db.Date
  startDate        DateTime  @map("start_date") @db.Date
  endDate          DateTime? @map("end_date") @db.Date
  isActive         Boolean   @default(true) @map("is_active")
  ownerUserId      String?   @map("owner_user_id")
  beneficiaryScope String    @default("shared") @map("beneficiary_scope")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  tenant       Tenant        @relation(fields: [tenantId], references: [id])
  category     Category      @relation(fields: [categoryId], references: [id])
  account      Account       @relation(fields: [accountId], references: [id])
  transactions Transaction[]

  @@index([tenantId], map: "idx_recurring_tenant")
  @@index([tenantId, nextDueDate], map: "idx_recurring_tenant_next_due")
  @@map("recurring_transactions")
}
```

---

## 6) Índices estratégicos

Os índices foram definidos para otimizar as queries mais frequentes do sistema:

| Índice | Tabela | Justificativa |
|--------|--------|---------------|
| `idx_transactions_tenant_date` | transactions | Extrato por período (query mais comum) |
| `idx_transactions_tenant_category` | transactions | Dashboard: gastos por categoria |
| `idx_transactions_tenant_type` | transactions | Filtro por tipo (receita/despesa) |
| `idx_transactions_tenant_status` | transactions | Filtro por status (pendente/pago) |
| `idx_recurring_tenant` | recurring_transactions | Listagem de recorrências |
| `idx_recurring_tenant_next_due` | recurring_transactions | Próximas contas a vencer |
| `idx_accounts_tenant` | accounts | Listagem de contas |
| `idx_categories_tenant` | categories | Listagem de categorias |

Todos os índices compostos começam com `tenant_id` porque **toda query do sistema filtra por tenant**.

---

## 7) Tipos e enums

O Prisma com MySQL não suporta enums nativos de forma ideal. Os tipos são armazenados como `String` e validados no backend via DTOs.

### Valores válidos por campo

```
Account.type:
  "checking" | "savings" | "credit_card" | "wallet" | "investment"

Category.type:
  "income" | "expense" | "investment" | "transfer"

Transaction.type:
  "income" | "expense" | "transfer"

Transaction.status:
  "pending" | "paid" | "cancelled"

Transaction.beneficiary_scope:
  "individual" | "shared"

RecurringTransaction.frequency:
  "weekly" | "monthly" | "yearly"

TenantMember.role:
  "admin" | "member"

Invitation.status:
  "pending" | "accepted" | "expired"
```

---

## 8) Seed de dados iniciais

Ao criar um novo tenant, o sistema deve criar automaticamente as categorias default:

### Categorias de despesa

Moradia, Alimentação, Transporte, Saúde, Lazer, Assinaturas, Pets, Educação

### Categorias de receita

Salário, Freelance, Reembolso, Rendimentos, Outros

### Lógica do seed

```typescript
// prisma/seed.ts — executado no onboarding de cada tenant
const defaultCategories = [
  { name: 'Moradia', type: 'expense', color: '#EF4444', icon: 'home' },
  { name: 'Alimentação', type: 'expense', color: '#F97316', icon: 'utensils' },
  { name: 'Transporte', type: 'expense', color: '#3B82F6', icon: 'car' },
  // ...
  { name: 'Salário', type: 'income', color: '#22C55E', icon: 'wallet' },
  // ...
];
```

---

## 9) Regras de integridade

### Soft delete

* **Categories**: usa `is_archived` em vez de deletar (preserva histórico de transações)
* **Accounts**: usa `is_active` em vez de deletar (preserva transações vinculadas)
* **Transactions**: pode ser deletada (hard delete) — o usuário tem controle total

### Cascade

* Deletar um **tenant** deve deletar todos os dados vinculados (members, accounts, categories, transactions, recurring)
* Deletar um **user** deve remover seus `tenant_members` e `refresh_tokens`

### Constraints

* `tenant_members`: unique em `[tenant_id, user_id]` — um user só pode ser membro uma vez
* `invitations`: unique em `token` — cada convite tem token único
* `users`: unique em `email` — um e-mail por conta

---

## 10) Migrations

### Fluxo de trabalho

```bash
# Desenvolvimento — cria migration a partir de mudanças no schema
npx prisma migrate dev --name <nome_descritivo>

# Produção (Hostinger) — aplica migrations pendentes
npx prisma migrate deploy

# Gerar client após mudanças
npx prisma generate
```

### Convenção de nomes de migration

```
YYYYMMDDHHMMSS_<ação>_<entidade>
```

Exemplos:
* `20260620120000_create_initial_schema`
* `20260625100000_add_notes_to_transactions`
* `20260701150000_add_tags_table`

---

## 11) Performance e boas práticas

* **Paginação**: toda listagem deve ser paginada (cursor-based ou offset com limit)
* **Select específico**: usar `select` do Prisma para não trazer colunas desnecessárias em queries pesadas
* **Transactions do banco**: usar `prisma.$transaction()` para operações que precisam de atomicidade (ex: transferência entre contas)
* **Decimal para valores monetários**: nunca usar `Float` — sempre `Decimal(12,2)`
* **UTC para datas**: armazenar tudo em UTC, converter no frontend
* **Connection pool**: Prisma gerencia automaticamente, mas configurar `connection_limit` se necessário na Hostinger

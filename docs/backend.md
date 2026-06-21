# Backend — NestJS + Prisma + MySQL

## 1) Stack

| Tecnologia | Função |
|------------|--------|
| **NestJS** | Framework backend (Node.js) |
| **TypeScript** | Tipagem estática |
| **Prisma** | ORM e migrations |
| **MySQL** | Banco de dados relacional |
| **Passport + JWT** | Autenticação |
| **class-validator + class-transformer** | Validação de DTOs |
| **bcrypt** | Hash de senhas |
| **nodemailer** | Envio de e-mails (convite, recuperação de senha) |
| **@nestjs/config** | Variáveis de ambiente |
| **helmet + cors** | Segurança HTTP |

---

## 2) Arquitetura — Modular com camadas (NestJS Modular + Clean Architecture)

O NestJS já é modular por natureza. A arquitetura combina a **estrutura modular do NestJS** com **camadas inspiradas em Clean Architecture** dentro de cada módulo.

### Por que não hexagonal pura?

Hexagonal/Clean Architecture pura adicionaria complexidade desnecessária para o MVP. A abordagem é pragmática: usar camadas claras (controller → service → repository) com inversão de dependência onde faz sentido, sem over-engineering com ports/adapters formais.

```
src/
├── main.ts                         # Bootstrap da aplicação
├── app.module.ts                   # Módulo raiz
│
├── common/                         # Código compartilhado entre módulos
│   ├── decorators/
│   │   ├── current-user.decorator.ts    # @CurrentUser() para extrair user do request
│   │   └── current-tenant.decorator.ts  # @CurrentTenant() para extrair tenant_id
│   ├── guards/
│   │   ├── jwt-auth.guard.ts            # Verifica JWT válido
│   │   └── tenant.guard.ts             # Verifica se user pertence ao tenant
│   ├── interceptors/
│   │   └── tenant-scope.interceptor.ts  # Injeta tenant_id automaticamente nas queries
│   ├── filters/
│   │   └── http-exception.filter.ts     # Tratamento global de erros
│   ├── pipes/
│   │   └── validation.pipe.ts           # Validação global de DTOs
│   ├── middlewares/
│   │   └── tenant-context.middleware.ts # Extrai tenant do token e coloca no request
│   ├── types/                           # Tipos globais
│   └── utils/                           # Helpers puros
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts       # POST /auth/register, /auth/login, /auth/forgot-password
│   │   ├── auth.service.ts          # Lógica de autenticação
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts      # Validação do token JWT
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── forgot-password.dto.ts
│   │
│   ├── tenant/
│   │   ├── tenant.module.ts
│   │   ├── tenant.controller.ts     # POST /tenants, POST /tenants/invite
│   │   ├── tenant.service.ts        # Criação do workspace, convite, aceite
│   │   ├── tenant.repository.ts     # Acesso ao banco via Prisma
│   │   └── dto/
│   │       ├── create-tenant.dto.ts
│   │       └── invite-member.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts      # GET /users/me, PATCH /users/me
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── dto/
│   │
│   ├── accounts/
│   │   ├── accounts.module.ts
│   │   ├── accounts.controller.ts   # CRUD /accounts
│   │   ├── accounts.service.ts
│   │   ├── accounts.repository.ts
│   │   └── dto/
│   │
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts # CRUD /categories
│   │   ├── categories.service.ts
│   │   ├── categories.repository.ts
│   │   └── dto/
│   │
│   ├── transactions/
│   │   ├── transactions.module.ts
│   │   ├── transactions.controller.ts # CRUD /transactions
│   │   ├── transactions.service.ts    # Regras de negócio financeiras
│   │   ├── transactions.repository.ts
│   │   └── dto/
│   │       ├── create-transaction.dto.ts
│   │       ├── update-transaction.dto.ts
│   │       └── transaction-filters.dto.ts
│   │
│   ├── recurring/
│   │   ├── recurring.module.ts
│   │   ├── recurring.controller.ts  # CRUD /recurring
│   │   ├── recurring.service.ts     # Lógica de geração de ocorrências
│   │   ├── recurring.repository.ts
│   │   └── dto/
│   │
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.controller.ts  # GET /dashboard/summary, /dashboard/charts
│   │   ├── dashboard.service.ts     # Agregações e métricas
│   │   └── dashboard.repository.ts
│   │
│   └── mail/
│       ├── mail.module.ts
│       ├── mail.service.ts          # Envio de e-mails (convite, recuperação)
│       └── templates/               # Templates HTML de e-mail
│
├── prisma/
│   ├── prisma.module.ts
│   ├── prisma.service.ts            # Instância do PrismaClient como serviço NestJS
│   └── seed.ts                      # Seed de categorias default
│
└── config/
    ├── app.config.ts
    ├── jwt.config.ts
    └── mail.config.ts
```

---

## 3) Camadas e responsabilidades

```
Request → Controller → Service → Repository → Prisma → MySQL
                          ↑
                     Regras de negócio
```

### Controller

* Recebe a request HTTP
* Valida input via DTOs (class-validator)
* Delega para o Service
* Retorna a response formatada
* **Não contém lógica de negócio**

### Service

* Contém **toda a lógica de negócio**
* Orquestra chamadas ao Repository
* Valida regras de domínio (ex: conta pertence ao tenant?)
* Lança exceções de negócio (NotFoundException, ForbiddenException)
* É onde ficam as regras mais importantes do sistema

### Repository

* Camada de acesso a dados
* Encapsula chamadas ao Prisma
* **Sempre recebe `tenantId` como parâmetro** e aplica o filtro
* Retorna entidades tipadas
* Facilita testes (mock do repository, não do Prisma)

### DTOs

* Definem o contrato de entrada (request body, query params)
* Validados automaticamente pelo ValidationPipe global
* Cada operação tem seu DTO específico (Create, Update, Filters)

---

## 4) Princípios

### SOLID

| Princípio | Aplicação no NestJS |
|-----------|-------------------|
| **S — Single Responsibility** | Controller não tem lógica de negócio. Service não faz query SQL. Repository não valida regras. Cada classe tem um papel. |
| **O — Open/Closed** | Guards e interceptors são adicionados sem modificar controllers. Novos módulos são adicionados sem alterar os existentes. |
| **L — Liskov Substitution** | Services implementam interfaces. Um `MailService` pode ser substituído por um `MockMailService` nos testes sem quebrar nada. |
| **I — Interface Segregation** | DTOs específicos por operação. `CreateTransactionDTO` e `UpdateTransactionDTO` são separados, não um DTO genérico. |
| **D — Dependency Inversion** | NestJS injeta dependências via construtor. Controller depende da abstração do Service, não da implementação. Repository é injetado no Service via DI. |

### Clean Code

* Nomes descritivos em inglês
* Métodos pequenos com propósito único
* Sem `any` — tipar tudo
* Sem lógica duplicada — extrair para utils ou métodos privados
* Early return para reduzir aninhamento
* Erros explícitos com mensagens claras

### DRY com moderação

* Código duplicado em 2 lugares: tolerar
* Código duplicado em 3+ lugares: extrair para `common/`
* Abstrações prematuras são piores que duplicação

---

## 5) Multi-tenancy — Implementação

### Fluxo de tenant isolation

```
1. Usuário faz login → recebe JWT com { userId, tenantId }
2. Toda request autenticada passa pelo TenantContextMiddleware
3. Middleware extrai tenantId do token e coloca no request
4. TenantGuard verifica se o user é membro do tenant
5. Controllers usam @CurrentTenant() para pegar o tenantId
6. Services passam tenantId para os Repositories
7. Repositories SEMPRE filtram por tenantId
```

### Regra obrigatória

Todo repository deve receber `tenantId` e usar como filtro:

```typescript
// Exemplo de método no repository
async findAll(tenantId: string, filters: TransactionFiltersDTO) {
  return this.prisma.transaction.findMany({
    where: {
      tenantId,  // SEMPRE presente
      ...this.buildFilters(filters),
    },
  });
}
```

**Nunca fazer query sem `tenantId`** (exceto na tabela `users`).

---

## 6) Autenticação — JWT

### Fluxo

1. `POST /auth/register` → cria user + hash da senha
2. `POST /auth/login` → valida credenciais → retorna `{ accessToken, refreshToken }`
3. Requests autenticadas enviam `Authorization: Bearer <token>`
4. JWT payload: `{ sub: userId, tenantId, email }`

### Tokens

* **Access token**: curta duração (15min–1h)
* **Refresh token**: longa duração (7 dias), armazenado no banco
* Endpoint `POST /auth/refresh` para renovar

---

## 7) Endpoints da API

### Auth

```
POST   /auth/register          # Criar conta
POST   /auth/login             # Login
POST   /auth/refresh           # Renovar token
POST   /auth/forgot-password   # Solicitar recuperação
POST   /auth/reset-password    # Redefinir senha
```

### Tenant

```
POST   /tenants                # Criar workspace do casal
POST   /tenants/invite         # Convidar parceiro(a)
POST   /tenants/accept-invite  # Aceitar convite
GET    /tenants/me             # Dados do tenant atual
```

### Users

```
GET    /users/me               # Perfil do usuário logado
PATCH  /users/me               # Atualizar perfil
```

### Accounts

```
GET    /accounts               # Listar contas do tenant
POST   /accounts               # Criar conta
PATCH  /accounts/:id           # Atualizar conta
DELETE /accounts/:id           # Desativar conta
```

### Categories

```
GET    /categories             # Listar categorias do tenant
POST   /categories             # Criar categoria
PATCH  /categories/:id         # Atualizar categoria
DELETE /categories/:id         # Arquivar categoria
```

### Transactions

```
GET    /transactions           # Listar (com filtros via query params)
POST   /transactions           # Criar movimentação
PATCH  /transactions/:id       # Atualizar
DELETE /transactions/:id       # Remover
```

### Recurring

```
GET    /recurring              # Listar recorrências
POST   /recurring              # Criar recorrência
PATCH  /recurring/:id          # Editar (ocorrência, futuras ou série)
DELETE /recurring/:id          # Encerrar recorrência
POST   /recurring/generate     # Gerar próximas ocorrências
```

### Dashboard

```
GET    /dashboard/summary      # Resumo financeiro do mês
GET    /dashboard/charts       # Dados para gráficos
GET    /dashboard/upcoming     # Próximas contas a vencer
```

---

## 8) Tratamento de erros

### Padrão de response de erro

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    { "field": "amount", "message": "amount must be a positive number" }
  ]
}
```

### Exceções padronizadas

* `400 Bad Request` — validação de input
* `401 Unauthorized` — token inválido ou expirado
* `403 Forbidden` — sem permissão (tentou acessar outro tenant)
* `404 Not Found` — recurso não encontrado no tenant
* `409 Conflict` — conflito (ex: e-mail já cadastrado)

### HttpExceptionFilter global

Captura todas as exceções e formata no padrão acima, sem vazar detalhes internos.

---

## 9) Segurança

* **Helmet**: headers de segurança HTTP
* **CORS**: configurado para aceitar apenas o domínio do frontend
* **Rate limiting**: limitar tentativas de login e requests por IP
* **Validação de input**: class-validator em todos os DTOs
* **SQL injection**: Prisma já parametriza queries (sem raw queries desnecessárias)
* **Password hashing**: bcrypt com salt rounds adequados
* **Tenant isolation**: guard em todas as rotas protegidas
* **Secrets**: variáveis de ambiente via @nestjs/config, nunca hardcoded

---

## 10) Deploy — Hostinger Compartilhada

### Limitações da hospedagem compartilhada

* Suporte a Node.js via painel (sem controle total do processo)
* Sem Docker, sem PM2 configurável
* MySQL disponível no painel da Hostinger
* Porta do Node.js definida pelo painel

### Estratégia de deploy

1. Build do projeto: `npm run build` (gera `dist/`)
2. Upload dos arquivos para a Hostinger (via Git ou FTP)
3. Configurar o Node.js pelo painel da Hostinger (entry point: `dist/main.js`)
4. Configurar variáveis de ambiente pelo painel
5. MySQL criado e gerenciado pelo painel da Hostinger

### Variáveis de ambiente necessárias

```env
DATABASE_URL=mysql://user:password@localhost:3306/gestao_casal
JWT_SECRET=<chave-secreta-forte>
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
MAIL_HOST=smtp.hostinger.com
MAIL_USER=noreply@seudominio.com
MAIL_PASS=<senha>
FRONTEND_URL=https://seudominio.com
```

### Prisma na Hostinger

* Rodar `npx prisma migrate deploy` após upload para aplicar migrations
* Rodar `npx prisma db seed` na primeira vez para categorias default
* Não rodar `prisma migrate dev` em produção

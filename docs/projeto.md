# Projeto: Gestão Financeira para Casal (Multi-tenant)

## 1) Objetivo do sistema

Plataforma web de **gestão financeira compartilhada para casais**, onde **duas pessoas pertencem ao mesmo tenant** e controlam em conjunto suas finanças.

O sistema deve ser **single-tenant por casal na experiência de uso**, mas **multi-tenant na arquitetura**, permitindo escalar para vários casais/organizações sem misturar dados.

### Público-alvo

* Casais que querem controlar dinheiro juntos
* Uso pessoal do autor e sua esposa
* Vitrine de portfólio full stack com arquitetura multi-tenant real

### Proposta de valor para portfólio

* Demonstra domínio de **arquitetura multi-tenant** em produção
* Projeto real com usuários reais (o próprio casal)
* Stack moderna e boas práticas (clean architecture, testes, CI/CD)
* Base preparada para expansão com IA

---

## 2) Visão de produto

### Proposta central

Cada casal possui um **workspace financeiro único**.
Dentro dele, os dois membros têm acesso às mesmas informações, mas o sistema identifica **quem lançou cada movimentação**.

### Modelo de domínio

* **Tenant / Organization** = o casal
* **Users / Members** = duas pessoas vinculadas ao tenant
* **Todos os dados financeiros pertencem ao tenant**
* Cada registro financeiro tem um **owner** (quem lançou ou de quem é o gasto/receita)

### Inclusividade

Modelar membros como `members` (sem fixar gênero no domínio), o que resolve:

* Casais homoafetivos
* Maior flexibilidade de domínio
* Menos regra hardcoded no sistema

---

## 3) MVP — Escopo da primeira entrega

O MVP foca nas funcionalidades essenciais para o casal começar a usar o sistema no dia a dia.

### 3.1. Autenticação e onboarding

#### Funcionalidades

* Cadastro de usuário (e-mail + senha)
* Login individual
* Criação do workspace do casal (tenant)
* Convite do parceiro(a) por e-mail
* Aceite de convite e vinculação ao tenant
* Recuperação de senha

#### Fluxo de onboarding

1. Usuário A cria a conta
2. Cria o workspace do casal (nome do espaço)
3. Convida o parceiro(a) por e-mail
4. Usuário B aceita o convite e passa a fazer parte do mesmo tenant
5. Categorias e contas default são criadas automaticamente

---

### 3.2. Contas / Carteiras

Fundamental para o sistema não virar apenas uma planilha de lançamentos.

#### Exemplos de contas

* Conta corrente Membro A
* Conta corrente Membro B
* Conta conjunta
* Cartão de crédito X
* Carteira em dinheiro

#### Campos da entidade

* `id`, `tenant_id`, `name`, `type` (corrente, poupança, cartão, carteira, investimento)
* `owner_user_id` (opcional — conta individual ou conjunta)
* `initial_balance`, `is_active`

#### Benefícios

* Saldo por conta
* Rastrear de onde saiu o dinheiro
* Separar cartão, conta e caixa
* Relatórios mais ricos

---

### 3.3. Categorias

#### Campos da entidade

* `id`, `tenant_id`, `name`
* `type` → `income | expense | investment | transfer`
* `color`, `icon`
* `is_default`, `is_archived`

#### Regras

* Categorias pertencem ao tenant
* Categorias default são criadas no onboarding
* O casal pode criar categorias próprias
* Categorias podem ser arquivadas sem quebrar histórico

#### Categorias default no onboarding

**Despesas:** Moradia, Alimentação, Transporte, Saúde, Lazer, Assinaturas, Pets, Educação

**Receitas:** Salário, Freelance, Reembolso, Rendimentos, Outros

---

### 3.4. Movimentações financeiras (core)

Este é o coração do sistema.

#### Tipos de movimentação

| Tipo | Exemplos |
|------|----------|
| **Receita** | Salário, freelas, renda extra, reembolso |
| **Despesa** | Supermercado, aluguel, energia, farmácia, lazer |
| **Transferência interna** | Entre contas, pagamento entre parceiros |

#### Campos da transação

* `id`, `tenant_id`, `type`, `amount`, `date`
* `category_id`, `account_id`
* `description`, `notes`
* `owner_user_id` (quem lançou)
* `paid_by_user_id` (quem pagou)
* `beneficiary_scope` → `individual | shared`
* `status` → `pending | paid | cancelled`

#### Classificação individual vs compartilhado

* **Individual**: gasto/receita de uma pessoa
* **Compartilhado**: gasto/receita do casal

Exemplos:
* Compra pessoal → `individual`
* Supermercado da casa → `shared`
* Salário do membro A → `individual`

---

### 3.5. Gastos recorrentes

#### Funcionalidades

* Cadastrar despesas recorrentes (Netflix, aluguel, internet, academia, plano de saúde)
* Definir frequência: mensal, semanal ou anual
* Gerar automaticamente as próximas ocorrências
* Pausar ou encerrar recorrência
* Editar apenas a ocorrência atual ou toda a série

---

### 3.6. Extrato

#### O que mostrar

* Lista cronológica de movimentações
* Filtros: período, categoria, pessoa, tipo, status, conta/carteira
* Busca textual

#### Diferencial visual

Cada lançamento indica claramente:
* Se é do casal ou individual (badge)
* Quem lançou (avatar/iniciais + cor associada ao membro)
* Quem pagou

---

### 3.7. Dashboard principal

A dashboard concentra a operação do dia a dia, sem navegação excessiva.

#### Resumo financeiro do mês

* Receita total
* Despesa total
* Saldo do mês
* Total de gastos recorrentes
* Percentual comprometido da renda

#### Cards principais

* Receita mensal
* Gastos do mês
* Gastos recorrentes
* Saldo disponível
* Contas a vencer

#### Ações rápidas (modal/drawer)

* Adicionar receita
* Adicionar despesa
* Registrar transferência
* Criar categoria

#### Gráficos

* Receitas x despesas por mês
* Gastos por categoria
* Divisão dos gastos por pessoa

---

### 3.8. Métricas do MVP

#### Financeiras

* Receita e despesa total do mês
* Saldo do mês
* Total recorrente
* Gasto por categoria
* Gasto por pessoa
* Percentual da renda comprometida
* Economia do mês

#### De comportamento

* Maior categoria de gasto
* Comparação com mês anterior

---

### 3.9. Navegação e UX do MVP

#### Página principal (dashboard) com seções:

* Cards de métricas
* Gráficos
* Extrato resumido
* Ações rápidas

#### Ações em modal/drawer:

* Criar despesa, receita, transferência
* Criar categoria
* Editar conta

#### Páginas separadas:

* Extrato completo com filtros
* Configurações do workspace
* Gestão de categorias
* Gestão de contas/carteiras
* Perfil do usuário

---

## 4) Regras de negócio

### 4.1. Regra de pertencimento (tenant isolation)

Nenhum usuário pode acessar dados de outro tenant. `tenant_id` é obrigatório em todas as queries.

### 4.2. Regra de categoria

Uma categoria só pode ser usada se pertencer ao tenant.

### 4.3. Regra de conta

Uma conta só pode receber movimentações do mesmo tenant.

### 4.4. Regra de recorrência

Ao editar uma despesa recorrente, o sistema deve permitir:
* Editar só a ocorrência
* Editar ocorrências futuras
* Editar toda a série

### 4.5. Regra de transferência

Transferência interna **não pode duplicar** gasto do casal no resumo financeiro.

### 4.6. Regra de investimento

Aporte não deve ser contabilizado como "despesa comum". Tratar como transferência da conta corrente para a conta de investimento.

---

## 5) Arquitetura multi-tenant

### Estratégia: single database + tenant_id

* `tenant_id` em todas as tabelas de domínio
* Escopo global no backend para filtrar por tenant
* Validação de autorização em toda operação de leitura/escrita
* Guards/middlewares para impedir acesso cruzado

### Tabelas sem tenant_id (globais):

* `users` (autenticação)
* Tabelas de configuração global

### Entidades principais

* **Tenant** → representa o casal
* **User** → usuário autenticado
* **TenantMember** → vínculo entre usuário e tenant (role: admin/member)
* **Account** → conta/carteira/cartão
* **Category** → categoria financeira
* **Transaction** → movimentação financeira
* **RecurringTransaction** → template de recorrência

---

## 6) Modelo de permissão e visão dos dados

### Regra principal

Os dois membros do casal enxergam **tudo** do tenant.

### Classificação por escopo

* `beneficiary_scope: individual` → gasto/receita de uma pessoa
* `beneficiary_scope: shared` → gasto/receita do casal

### Campos de autoria

* `owner_user_id` → de quem é o gasto/receita
* `paid_by_user_id` → quem efetivamente pagou

---

## 7) Roadmap de entrega do MVP

### Fase 1 — Fundação

* Autenticação (registro, login, recuperação de senha)
* Criação do tenant (workspace do casal)
* Convite e aceite do parceiro(a)
* Cadastro de categorias default
* Cadastro de contas/carteiras

### Fase 2 — Core financeiro

* CRUD de receitas e despesas
* Transferências internas
* Extrato com filtros
* Dashboard com cards e resumo mensal

### Fase 3 — Recorrências e refinamento

* Cadastro e gestão de recorrências
* Geração automática de ocorrências
* Resumo de gastos fixos
* Contas a vencer
* Gráficos da dashboard

---

## 8) Features futuras (pós-MVP)

### Fase 4 — Investimentos

* Contas de investimento
* Aportes e resgates
* Resumo investido no mês
* Categorias de investimento (renda fixa, ações, cripto, previdência)
* Visão simples de patrimônio

### Fase 5 — Produto mais completo

* Metas financeiras (ex: juntar R$ 20.000 para viagem, reserva de emergência)
* Orçamento mensal por categoria
* Alertas de vencimento
* Dashboard por período customizado
* Anexos/comprovantes nas transações
* Tags nas movimentações
* Métricas avançadas (média mensal, evolução da reserva, tendência de despesas)

### Fase 6 — Integração e automação

* Importação CSV/OFX de extratos bancários
* Conciliação financeira
* Notificações (push/e-mail)
* Centros de custo do casal
* Visão patrimonial consolidada
* Relatórios completos e exportáveis

### Fase 7 — Inteligência artificial

* **Categorização automática**: ao lançar "iFood", o sistema sugere "Alimentação"
* **Resumo financeiro mensal**: "Vocês gastaram 18% a mais com lazer e 12% menos com transporte"
* **Insights automáticos**: "Gastos recorrentes representam 42% da renda mensal"
* **Busca por linguagem natural**: "Quanto gastamos com mercado nos últimos 3 meses?"
* **Planejamento de meta**: "Quanto precisamos guardar por mês para viajar em dezembro?"
* **Classificação automática** de categorias
* **Previsão de gasto** do mês

---

## 9) Resumo do produto

### Nome conceitual

Sistema SaaS multi-tenant de gestão financeira para casais, com dashboard unificado, extrato compartilhado, categorização de receitas/despesas, controle de gastos recorrentes e métricas financeiras do casal.

### Diferenciais do MVP

* Tenant por casal com isolamento real de dados
* Dois membros no mesmo workspace
* Extrato com autoria por membro
* Visão compartilhada + individual
* Gastos recorrentes com gestão de série
* Dashboard dinâmica com ações rápidas
* Arquitetura preparada para escalar (multi-tenant, IA, integrações)

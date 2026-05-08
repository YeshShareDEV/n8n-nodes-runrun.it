# n8n-nodes-runrunit

Node comunitário n8n para integração com a API do **Runrun.it** (v1.0).

[![npm version](https://img.shields.io/npm/v/n8n-nodes-runrunit)](https://www.npmjs.com/package/n8n-nodes-runrunit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Índice

- [Instalação](#instalação)
- [Credenciais](#credenciais)
- [Recursos e Operações](#recursos-e-operações)
  - [User](#user-usuários)
  - [Task](#task-tarefas)
  - [Team](#team-equipes)
  - [Projects](#projects-projetos)
  - [Board Stages](#board-stages-estágios-de-board)
  - [Comments](#comments-comentários)
  - [Documents](#documents-documentos)
  - [Checklists](#checklists)
  - [Checklist Items](#checklist-items-itens-de-checklist)
  - [Clients](#clients-clientes)
  - [Descendants](#descendants-tarefas-descendentes)
  - [Descriptions](#descriptions-descrições)
  - [Time Worked](#time-worked-tempo-trabalhado)
- [Filtros e Ordenação](#filtros-e-ordenação)
- [Paginação](#paginação)
- [Desenvolvimento](#desenvolvimento)

---

## Instalação

### Via interface do n8n (recomendado)

1. Acesse **Settings → Community Nodes** no n8n
2. Clique em **Install**
3. Digite `n8n-nodes-runrunit` e confirme

### Manual

```bash
cd ~/.n8n
npm install n8n-nodes-runrunit
```

Reinicie o n8n após a instalação.

---

## Credenciais

Crie uma credencial do tipo **Runrunit API** com os seguintes campos:

| Campo | Descrição |
|-------|-----------|
| `App-Key` | Chave da conta Runrun.it |
| `User-Token` | Token de autenticação do usuário |

Ambos os valores são enviados como headers em todas as requisições. Você encontra essas informações em **Configurações → Integrações → API** dentro do Runrun.it.

---

## Recursos e Operações

A base URL de todas as requisições é `https://runrun.it/api/v1.0`.

---

### User (Usuários)

**Endpoint base:** `/users`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/users` |
| Get | GET | `/users/:id` |
| Create | POST | `/users` |
| Update | PUT | `/users/:id` |

Parâmetros de `Get Many`: `limit`, `page`, `search_term`, `returnAll`, `sort`, `sort_dir`

---

### Task (Tarefas)

**Endpoint base:** `/tasks`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/tasks` |
| Get | GET | `/tasks/:id` |
| Create | POST | `/tasks` |
| Update | PUT | `/tasks/:id` |
| Delete | DELETE | `/tasks/:id` |
| Play | POST | `/tasks/:id/play` |
| Pause | POST | `/tasks/:id/pause` |
| Deliver | POST | `/tasks/:id/deliver` |
| Reopen | POST | `/tasks/:id/reopen` |
| Move | POST | `/tasks/:id/move` |
| Move To Next Stage | POST | `/tasks/:id/move_to_next_stage` |
| Move To Top | POST | `/tasks/:id/move_to_top` |
| Clone | POST | `/tasks/clone` |
| Reestimate | POST | `/tasks/:id/reestimate` |
| Reposition | POST | `/tasks/:id/reposition` |
| Share | POST | `/tasks/:id/share` |
| Unshare | POST | `/tasks/:id/unshare` |
| Add Comment | POST | `/tasks/:id/comments` |
| Add Manual Work Period | POST | `/tasks/:id/add_manual_work_period` |
| Change Board | POST | `/tasks/:id/change_board` |
| Change Project | POST | `/tasks/:id/change_project` |
| Change Time Worked | POST | `/tasks/:id/change_time_worked` |
| Change Type | POST | `/tasks/:id/change_type` |
| Create Assignments | POST | `/tasks/:id/create_assignments` |
| Complete Workflow Step | POST | `/tasks/:id/complete_workflow_step` |
| Mark As Urgent | POST | `/tasks/:id/mark_as_urgent` |
| Get Subtasks | GET | `/tasks/:id/subtasks` |
| Get Fields | GET | `/tasks/:id/fields` |
| Get Form Answers | GET | `/tasks/:id/form_answers` |

Parâmetros de `Get Many`: `limit`, `page`, `returnAll`, `search_term`, `project_id`, `client_id`, `responsible_id`, `is_closed`, `sort`, `sort_dir`, `filters`

---

### Team (Equipes)

**Endpoint base:** `/teams`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/teams` |
| Get | GET | `/teams/:id` |
| Create | POST | `/teams` |
| Update | PUT | `/teams/:id` |
| Delete | DELETE | `/teams/:id` |
| Add Member | POST | `/teams/:id/add_member` |
| Remove Member | POST | `/teams/:id/remove_member` |

Parâmetros de `Get Many`: `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Projects (Projetos)

**Endpoint base:** `/projects`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/projects` |
| Get | GET | `/projects/:id` |
| Create | POST | `/projects` |
| Update | PUT | `/projects/:id` |
| Related Users | GET | `/projects/:id/related_users` |
| Move | POST | `/projects/:id/move` |
| Share | POST | `/projects/:id/share` |
| Unshare | POST | `/projects/:id/unshare` |
| Clone | POST | `/projects/:id/clone` |
| Change Board Stage | POST | `/projects/:id/change_board_stage` |
| List Filters | GET | `/projects/filters` |
| Get Filter | GET | `/projects/filters/:id` |
| Delete Filter | DELETE | `/projects/filters/:id` |

Parâmetros de `Get Many`: `page`, `returnAll`, `client_id`, `project_group_id`, `search_term`, `is_closed`, `sort`, `sort_dir`, `filters`

---

### Board Stages (Estágios de Board)

**Endpoint base:** `/boards/:boardId/stages`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/boards/:boardId/stages` |
| Get | GET | `/boards/:boardId/stages/:id` |
| Create | POST | `/boards/:boardId/stages` |
| Update | PUT | `/boards/:boardId/stages/:id` |
| Delete | DELETE | `/boards/:boardId/stages/:id` |
| Move | POST | `/boards/:boardId/stages/:id/move` |
| Update Use Latency Time | POST | `/boards/:boardId/stages/:id/update_use_latency_time` |
| Update Use Scrum Points | POST | `/boards/:boardId/stages/:id/update_use_scrum_points` |

Parâmetros de `Get Many`: `boardId` (obrigatório), `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Comments (Comentários)

**Endpoint base:** `/comments`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/tasks/:taskId/comments` |
| Get | GET | `/comments/:id` |
| Create | POST | `/comments` |
| Update | PUT | `/comments/:id` |
| Delete | DELETE | `/comments/:id` |
| Reaction | POST | `/comments/:id/reaction` |

Parâmetros de `Get Many`: `taskId`, `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Documents (Documentos)

**Endpoint base:** `/documents`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/tasks/:taskId/documents` ou `/documents` |
| Get | GET | `/documents/:id` |
| Delete | DELETE | `/documents/:id` |

Parâmetros de `Get Many`: `taskId` (opcional — filtra por tarefa), `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Checklists

**Endpoint base:** `/tasks/:taskId/checklist`

| Operação | Método | Rota |
|----------|--------|------|
| Get | GET | `/tasks/:taskId/checklist` |
| Create | POST | `/tasks/:taskId/checklist` |
| Update | PUT | `/tasks/:taskId/checklist` |
| Delete | DELETE | `/tasks/:taskId/checklist` |

---

### Checklist Items (Itens de Checklist)

**Endpoint base:** `/checklist_items`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/checklist_items` |
| Get | GET | `/checklist_items/:id` |
| Create | POST | `/checklist_items` |
| Update | PUT | `/checklist_items/:id` |
| Delete | DELETE | `/checklist_items/:id` |

Parâmetros de `Get Many`: `checklistId`, `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Clients (Clientes)

**Endpoint base:** `/clients`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/clients` |
| Get | GET | `/clients/:id` |
| Create | POST | `/clients` |
| Update | PUT | `/clients/:id` |
| Monthly Budgets | GET | `/clients/:id/monthly_budgets` |
| Update Monthly Budget | POST | `/clients/:id/update_monthly_budget` |

Parâmetros de `Get Many`: `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Descendants (Tarefas Descendentes)

**Endpoint base:** `/tasks/:taskId/descendants`

| Operação | Método | Rota |
|----------|--------|------|
| Get Many | GET | `/tasks/:taskId/descendants` |
| Create | POST | `/tasks/:taskId/descendants` |
| Delete | DELETE | `/descendants/:id` |

Parâmetros de `Get Many`: `taskId` (obrigatório), `limit`, `page`, `returnAll`, `sort`, `sort_dir`

---

### Descriptions (Descrições)

**Endpoint base:** `/descriptions`

| Operação | Método | Rota |
|----------|--------|------|
| Get | GET | `/descriptions?subject_type=...&subject_id=...` |
| Update | PUT | `/descriptions` |

---

### Time Worked (Tempo Trabalhado)

**Endpoint base:** `/reports/time_worked`

| Operação | Método | Rota |
|----------|--------|------|
| Get | GET | `/reports/time_worked` |

---

## Filtros e Ordenação

### Ordenação

Todas as operações **Get Many** suportam os parâmetros:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `sort` | string | Nome do campo para ordenar os resultados (ex: `created_at`, `title`) |
| `sort_dir` | options | Direção da ordenação: `asc` (padrão) ou `desc` |

> **Nota:** `sort_dir` só aparece na interface e só é enviado na requisição quando `sort` está preenchido.

### Filtros Pós-Execução

Os recursos **Task**, **Projects** e **Clients** suportam uma coleção `Filters` que permite filtrar os resultados localmente após a resposta da API, usando operadores como `equals`, `contains`, `gt`, `lt`, `isTrue`, `isFalse`.

---

## Paginação

As operações `Get Many` suportam:

| Campo | Descrição |
|-------|-----------|
| `Return All` | Quando ativado, busca todos os registros (usa `limit=99000`) |
| `Limit` | Número máximo de registros por página (máx. 100) |
| `Page` | Número da página para paginação baseada em offset |

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build (compila TypeScript e copia README para dist/)
npm run build

# Modo de desenvolvimento com hot-reload
npm run dev

# Lint
npm run lint
npm run lint:fix
```

### Estrutura do projeto

```
.
├── credentials/
│   └── RunrunitApi.credentials.ts   # Configuração das credenciais
├── nodes/
│   └── Runrunit/
│       ├── Runrunit.node.ts         # Definição principal do node
│       ├── GenericFunctions.ts      # makeRequest, applyPostFilters, etc.
│       └── resources/
│           ├── <resource>/
│           │   ├── index.ts         # Operações (options) do resource
│           │   ├── getAll.ts        # Propriedades da operação Get Many
│           │   ├── get.ts           # Propriedades da operação Get
│           │   ├── create.ts        # Propriedades da operação Create
│           │   └── update.ts        # Propriedades da operação Update
│           └── executers/
│               └── <Resource>Execute.ts  # Lógica de execução HTTP
├── package.json
└── README.md
```

---

## Links

- [Documentação da API Runrun.it](https://runrun.it/api-docs)
- [Repositório GitHub](https://github.com/YeshShareDEV/n8n-nodes-runrun.it)
- [npm](https://www.npmjs.com/package/n8n-nodes-runrunit)
- [Documentação de nodes comunitários n8n](https://docs.n8n.io/integrations/community-nodes/)

---

## Licença

[MIT](LICENSE)

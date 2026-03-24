# API Runrun.it

Base URL: `/api/v1.0/`

## Autenticação

Todas as requests devem incluir os cabeçalhos de autenticação `App-Key` e `User-Token` (fornecidos na área de Integração). Se `app_key` ou `user_token` estiverem incorretos a API retornará `401 Unauthorized`.

Como obter as chaves:
- Acesse *Integration and Apps* → *API and Webhooks* no painel do Runrun.it.
- O `app_key` identifica a conta; o `user_token` identifica o usuário (cada usuário tem o seu).

Exemplo de cabeçalhos comuns:

- `App-Key: 1a219437eab893dc115509bb85e06d77`
- `User-Token: 9flMUzLxQtxohKGZjU5`
- `Content-Type: application/json`

## Limites de requisição (Rate limits)

- Limite: `100` requests por minuto por `app_key`.
- Se o limite for excedido, a API responde com `429 Too Many Requests` e cabeçalhos relacionados:
	- `RateLimit-Limit` — request limit
	- `RateLimit-Remaining` — remaining requests
	- `RateLimit-Reset` — timestamp quando o limite será restaurado

Excesso de uso repetido pode resultar no cancelamento do `app_key` para proteger o serviço.

## Formato de Dados

- Todas as respostas são em JSON. As requisições devem usar JSON (form-encoded também é aceito em alguns endpoints).
- Todas as datas usam o padrão ISO 8601 (urlencode quando houver caracteres especiais como `+`).

## Paginação

- Cabeçalhos usados:
	- `X-Item-Range`: indica o intervalo no formato `items {first}-{last}/{total}`.
	- `Link`: inclui links de navegação (`rel="self"`, `rel="prev"`, `rel="next"`, `rel="last"`).
	- `X-Item-Without-View-Permission` (opcional): contagem de itens que não podem ser vistos por permissão.
- Parâmetros de consulta:
	- `page` — página (inicia em 1)
	- `limit` — itens por página (default e máximo: 100)
	- `offset` — deslocamento para resultados
- Uso prático: faça a primeira requisição sem parâmetros, use o link `rel="next"` do cabeçalho `Link` para avançar até não existir próximo.

Observações: a paginação segue RFC 7233 e RFC 5988.

## Webhooks

- Gerenciamento: crie/edite/exclua webhooks em *API and Webhooks* no painel; informe a URL que receberá POSTs.
- Eventos suportados (exemplos): `task:create`, `task:update`, `task:destroy`, `task:deliver`, `task:reopen`, `task:move`, `task_assignment:play`, `task_assignment:pause`, `task:comment:create`, `project:create`, `client:create`, entre muitos outros.
- Para deletar um webhook use o botão de lixeira no painel.

Exemplos de payloads são enviados no corpo do POST para cada evento (JSON).

## Suporte

Se precisar de suporte para a API: help@runrun.it


## Endpoints por Tópico

### Activities
- `GET /api/v1.0/activities` — Get activities

### Board Stages
- `GET /api/v1.0/boards/:board_id/stages` — List all board stages
- `GET /api/v1.0/boards/:board_id/stages/:id` — Show a board stage
- `POST /api/v1.0/boards/:board_id/stages` — Create a board stage
- `PUT /api/v1.0/boards/:board_id/stages/:id` — Update a board stage
- `DELETE /api/v1.0/boards/:board_id/stages/:id` — Destroy a board stage
- `POST /api/v1.0/boards/:board_id/stages/:id/move` — Move a board stage to another group position
- `POST /api/v1.0/boards/:board_id/stages/:id/update_use_latency_time` — Update to use (or not) latency time
- `POST /api/v1.0/boards/:board_id/stages/:id/update_use_scrum_points` — Update to use (or not) scrum points

### Checklist Items
- `GET /api/v1.0/checklists/:checklist_id/items` — List checklist items
- `GET /api/v1.0/checklists/:checklist_id/items/:id` — Show a checklist item
- `POST /api/v1.0/checklists/:checklist_id/items` — Create a checklist item
- `PUT /api/v1.0/checklists/:checklist_id/items/:id` — Update a checklist item
- `DELETE /api/v1.0/checklists/:checklist_id/items/:id` — Destroy a checklist item

### Checklists
- `GET /api/v1.0/tasks/:task_id/checklist` — Show a checklist from a task
- `POST /api/v1.0/tasks/:task_id/checklist` — Create a checklist from a task
- `PUT /api/v1.0/tasks/:task_id/checklist` — Update a checklist from a task
- `DELETE /api/v1.0/tasks/:task_id/checklist` — Destroy a checklist from a task
- `GET /api/v1.0/task_templates/:task_template_id/checklist` — Show a checklist from a task template
- `POST /api/v1.0/task_templates/:task_template_id/checklist` — Create a checklist from a task template
- `PUT /api/v1.0/task_templates/:task_template_id/checklist` — Update a checklist from a task template
- `DELETE /api/v1.0/task_templates/:task_template_id/checklist` — Destroy a checklist from a task template

### Clients
- `GET /api/v1.0/clients` — List clients
- `GET /api/v1.0/clients/:id` — Show a client
- `POST /api/v1.0/clients` — Create a client
- `PUT /api/v1.0/clients/:id` — Update a client
- `GET /api/v1.0/clients/:client_id/monthly_budgets` — List all budgets
- `POST /api/v1.0/clients/:client_id/update_monthly_budget` — Create/update monthly budget

### Comments
- `GET /api/v1.0/tasks/:task_id/comments` — List comments on a task
- `GET /api/v1.0/comments/:id` — Show a specific comment
- `POST /api/v1.0/comments` — Create a new comment or project comment
- `PUT /api/v1.0/comments/:id` — Update a comment
- `DELETE /api/v1.0/comments/:id` — Destroy a comment
- `POST /api/v1.0/comments/:id/reaction` — Reaction to a comment

### Demanders
- `GET /api/v1.0/users/:user_id/demanders` — List all demanders of user
- `POST /api/v1.0/users/:user_id/demanders` — Add a demander to a user
- `POST /api/v1.0/users/:user_id/demanders/replace` — Replace a user demanders list
- `DELETE /api/v1.0/users/:user_id/demanders/:id` — Destroy a demander of a user

### Descendants
- `GET /api/v1.0/tasks/:task_id/descendants` — List all task descendants
- `POST /api/v1.0/tasks/:task_id/descendants` — Add a descendant task
- `DELETE /api/v1.0/tasks/:task_id/descendants/:id` — Remove a descendant task

### Description
- `GET /api/v1.0/descriptions` — Query descriptions (multiple / single)
- `PUT /api/v1.0/descriptions` — Update project or task template description

### Documents
- `GET /api/v1.0/tasks/:task_id/documents` — List documents for a task
- `GET /api/v1.0/documents/:id` — Show a document
- `GET /api/v1.0/documents/:id/download` — Download a document
- `GET /api/v1.0/documents/:id/thumbnail` — Download document thumbnail
- `GET /api/v1.0/documents/:id/preview` — Download document preview
- `POST /api/v1.0/tasks/:task_id/documents` — Create a document
- `POST /api/v1.0/documents/:id/mark_as_uploaded` — Mark document as uploaded
- `DELETE /api/v1.0/documents/:id` — Destroy a document
- `GET /api/v1.0/documents/download_zip` — Download multiple documents as zip


### Enterprises
- `GET /api/v1.0/enterprises/:id` — Show enterprise details
- `PUT /api/v1.0/enterprises/:id` — Update enterprise

### Estimates
- `GET /api/v1.0/tasks/:task_id/estimates` — Show estimates for a task
- `POST /api/v1.0/tasks/:task_id/estimates` — Create an estimate for a task

### EventNotification
- `GET /api/v1.0/users/:user_id/event_notifications` — List user's event notifications
- `POST /api/v1.0/users/:user_id/event_notifications/:id/mark_as_read` — Mark notification as read
- `POST /api/v1.0/users/:user_id/event_notifications/mark_all_as_read` — Mark all as read
- `DELETE /api/v1.0/users/:user_id/event_notifications/:id` — Delete a notification
- `POST /api/v1.0/users/:user_id/event_notifications/destroy_all` — Delete all notifications

### Filters
- `GET /api/v1.0/projects/filters` — List project filters
- `GET /api/v1.0/projects/filters/:id` — Show a project filter
- `DELETE /api/v1.0/projects/filters/:id` — Destroy a project filter
- `GET /api/v1.0/tasks/filters` — List task filters
- `GET /api/v1.0/tasks/filters/:id` — Show a task filter
- `DELETE /api/v1.0/tasks/filters/:id` — Destroy a task filter

### Justifications
- `POST /api/v1.0/justifications` — Create a justification (general or for task)
- `PUT /api/v1.0/justifications/:justification_id` — Update a justification text

### Manual Work Periods
- `GET /api/v1.0/manual_work_periods` — List manual work periods
- `GET /api/v1.0/manual_work_periods/:id` — Show a manual work period
- `POST /api/v1.0/manual_work_periods` — Create a manual work period
- `PUT /api/v1.0/manual_work_periods/:id` — Update a manual work period
- `DELETE /api/v1.0/manual_work_periods/:id` — Destroy a manual work period

### OffDays
- `GET /api/v1.0/off_days` — List off days
- `GET /api/v1.0/off_days/:id` — Show an off day
- `POST /api/v1.0/off_days` — Create an off day
- `PUT /api/v1.0/off_days/:id` — Update an off day
- `DELETE /api/v1.0/off_days/:id` — Destroy an off day

### Partners
- `GET /api/v1.0/users/:user_id/partners` — List partners of user
- `POST /api/v1.0/users/:user_id/partners` — Add a partner to a user
- `POST /api/v1.0/users/:user_id/partners/replace` — Replace a user's partners list
- `DELETE /api/v1.0/users/:user_id/partners/:id` — Destroy a partner of a user

### Prerequisites
- `GET /api/v1.0/tasks/:task_id/prerequisites` — List task prerequisites
- `POST /api/v1.0/tasks/:task_id/prerequisites` — Add a task prerequisite
- `DELETE /api/v1.0/tasks/:task_id/prerequisites/:id` — Remove a task prerequisite
- `GET /api/v1.0/task_templates/:task_template_id/prerequisites` — List task template prerequisites
- `POST /api/v1.0/task_templates/:task_template_id/prerequisites` — Add a task template prerequisite
- `POST /api/v1.0/task_templates/:task_template_id/prerequisites` — Add a task template prerequisite
- `DELETE /api/v1.0/task_templates/:task_template_id/prerequisites/:id` — Remove a task template prerequisite

### Project Description
- `PUT /api/v1.0/projects/:project_id/description` — Update the project description

### Project Groups
- `GET /api/v1.0/clients/:client_id/project_groups` — List all Project Groups
- `GET /api/v1.0/clients/:client_id/project_groups/:id` — Show a Project Group
- `POST /api/v1.0/clients/:client_id/project_groups` — Create a Project Group
- `PUT /api/v1.0/clients/:client_id/project_groups/:id` — Update a Project Group
- `DELETE /api/v1.0/clients/:client_id/project_groups/:id` — Destroy a Project Group
- `POST /api/v1.0/project_groups/:id/move` — Move project group to another client

### Project Sub Groups
- `GET /api/v1.0/project_groups/:project_group_id/project_sub_groups` — List Project Sub Groups by Project Group
- `GET /api/v1.0/clients/:client_id/project_sub_groups` — List Project Sub Groups by Client
- `GET /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Show a Project Sub Group
- `POST /api/v1.0/project_groups/:project_group_id/project_sub_groups` — Create a Project Sub Group
- `PUT /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Update a Project Sub Group
- `DELETE /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Destroy a Project Sub Group
- `POST /api/v1.0/project_sub_groups/:id/move` — Move project sub group to another project group

### Project Templates
- `GET /api/v1.0/project_templates` — List all Project Templates
- `GET /api/v1.0/project_templates/:id` — Show a Project Template
- `POST /api/v1.0/project_templates/` — Create a Project Template
- `PUT /api/v1.0/project_templates/:id` — Update a Project Template
- `DELETE /api/v1.0/project_templates/:id` — Destroy a Project Template

### Project Extra Cost
- `GET /api/v1.0/projects/:project_id/extra_costs` — List extra costs for a project
- `GET /api/v1.0/projects/:project_id/extra_costs/:id` — Show an extra cost
- `POST /api/v1.0/projects/:project_id/extra_costs` — Create a Project Extra Cost

### Projects
- `GET /api/v1.0/projects` — List all projects
- `GET /api/v1.0/projects/:id` — Show a Project
- `POST /api/v1.0/projects/` — Create a Project
- `PUT /api/v1.0/projects/:id` — Deliver or update project (various PUT actions)
- `GET /api/v1.0/projects/:id/related_users` — List users related in a project
- `POST /api/v1.0/projects/:id/move` — Move project (client / group / sub-group)
- `POST /api/v1.0/projects/:id/share` — Share the project
- `POST /api/v1.0/projects/:id/unshare` — Unshare the project
- `POST /api/v1.0/projects/:id/clone` — Clone a Project
- `POST /api/v1.0/projects/:id/change_board_stage` — Change a project board stage

### Tags
- `GET /api/v1.0/tags` — Query tags

### Task Description
- `GET /api/v1.0/tasks/:task_id/description` — Show the task description
- `PUT /api/v1.0/tasks/:task_id/description` — Update the task description

### Task Evaluations
- `POST /api/v1.0/tasks/:task_id/evaluations` — Update task evaluations
- `DELETE /api/v1.0/tasks/:task_id/evaluations` — Destroy all evaluations for a task
- `GET /api/v1.0/task_evaluations` — List task evaluations (supports filters by task/evaluator)
- `POST /api/v1.0/task_evaluations/:id/reset` — Reset a task evaluation
- `DELETE /api/v1.0/task_evaluations/:id` — Destroy a task evaluation

### Task Followers
- `GET /api/v1.0/tasks/:task_id/followers` — List all followers
- `POST /api/v1.0/tasks/:task_id/followers` — Create a Task Follower
- `DELETE /api/v1.0/tasks/:task_id/followers/:id` — Remove a Task Follower

### Task Templates
- `GET /api/v1.0/project_templates/:project_template_id/task_templates` — List Task Templates for a Project Template
- `GET /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Show a Task Template
- `POST /api/v1.0/project_templates/:project_template_id/task_templates` — Create a Task Template
- `PUT /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Update a Task Template
- `DELETE /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Destroy a Task Template

### Task Workflows
- `GET /api/v1.0/workflows` — Show a Workflow
- `POST /api/v1.0/workflows` — Create a Workflow
- `DELETE /api/v1.0/workflows` — Destroy a workflow

### Task Assignments
- `DELETE /api/v1.0/tasks/:task_id/assignments/:id` — Destroy a task assignment for another user
- `POST /api/v1.0/tasks/:task_id/assignments/:id/play` — Play a Task
- `POST /api/v1.0/tasks/:task_id/assignments/:id/pause` — Pause a task assignment
- `POST /api/v1.0/tasks/:task_id/assignments/:id/deliver` — Deliver a task assignment
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reopen` — Reopen a Task
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reposition` — Reposition a Task
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reestimate` — Reestimate a task assignment

### Task Types
- `GET /api/v1.0/task_types` — List task types
- `GET /api/v1.0/task_types/:id` — Show a task type
- `POST /api/v1.0/task_types` — Create a task type
- `PUT /api/v1.0/task_types/:id` — Update a task type

### Tasks
- `GET /api/v1.0/tasks` — Query tasks
- `GET /api/v1.0/tasks/:id` — Show a Task
- `GET /api/v1.0/tasks/:id/subtasks` — Show task subtasks
- `POST /api/v1.0/tasks` — Create a Task
- `PUT /api/v1.0/tasks/:id` — Update task (title, dates, points, fields, tags, etc.)
- `DELETE /api/v1.0/tasks/:id` — Destroy a Task
- `POST /api/v1.0/tasks/:id/play` — Play a Task / create assignment and play
- `POST /api/v1.0/tasks/:id/pause` — Pause a Task
- `POST /api/v1.0/tasks/:id/change_board` — Change a Task board
- `POST /api/v1.0/tasks/:id/change_project` — Change the project of a task
- `POST /api/v1.0/tasks/:id/change_type` — Change the type of a task
- `POST /api/v1.0/tasks/:id/deliver` — Deliver a Task
- `POST /api/v1.0/tasks/:id/reopen` — Reopen a Task
- `POST /api/v1.0/tasks/:id/reposition` — Reposition a Task
- `POST /api/v1.0/tasks/:id/reestimate` — Reestimate a Task
- `POST /api/v1.0/tasks/:id/share` — Share the task
- `POST /api/v1.0/tasks/:id/unshare` — Unshare the task
- `POST /api/v1.0/tasks/:id/complete_workflow_step` — Complete a workflow step
- `POST /api/v1.0/tasks/:id/undo_workflow_step` — Undo a workflow step
- `POST /api/v1.0/tasks/:id/mark_as_urgent` — Mark a task as urgent
- `POST /api/v1.0/tasks/:id/unmark_as_urgent` — Unmark a task as urgent
- `POST /api/v1.0/tasks/:id/create_assignments` — Create a task assignment for another user
- `POST /api/v1.0/tasks/:id/move_to_top` — Move a task to top
- `POST /api/v1.0/tasks/clone` — Clone a task
- `POST /api/v1.0/tasks/:id/move_to_next_stage` — Move a task to next stage
- `POST /api/v1.0/tasks/:id/move` — Move a task to another stage (with optional position)
- `GET /api/v1.0/tasks/:id/form_answers` — Get form answers that created the task
- `GET /api/v1.0/tasks/:id/fields` — List fields from task's board

### Teams
- `GET /api/v1.0/teams` — List teams
- `GET /api/v1.0/teams/:id` — Show a team
- `POST /api/v1.0/teams` — Create a team
- `PUT /api/v1.0/teams/:id` — Update a team
- `DELETE /api/v1.0/teams/:id` — Destroy a team
- `POST /api/v1.0/teams/:id/add_member` — Add a user to a team
- `POST /api/v1.0/teams/:id/remove_member` — Remove a user from a team

### Time Worked
- `GET /api/v1.0/reports/time_worked` — List time worked (grouped/filtered)

### Time Worked

- Method: GET
- Route: `/api/v1.0/reports/time_worked`
- Descrição: Gera relatório de horas trabalhadas agrupadas e filtradas por diversos critérios.
- Query params: `from`, `to` (ISO dates), `group_by` (`project`|`user`|`team`), `page`, `limit`
- Headers: `App-Key`, `User-Token`
- Responses: `200` — report object. Exemplo:
 - Responses: `200` — report object. Exemplo:
```json
{
  "from": "2026-03-01",
  "to": "2026-03-31",
  "group_by": "user",
  "data": [ { "user_id": 42, "hours": 120, "cost": 6000 } ]
}
```

### Users
- `GET /api/v1.0/users` — List users
- `GET /api/v1.0/users/:user_id` — Get a user by id
- `POST /api/v1.0/users` — Create a user
- `PUT /api/v1.0/users/:id` — Update a user

### Users

- Method: GET
- Route: `/api/v1.0/users`
- Descrição: Lista usuários do workspace. Suporta `search_term`, `page`, `limit`.
- Responses: `200` — array de user objects. Exemplo:
 - Responses: `200` — array of user objects. Exemplo:
```json
[
  { "id": 42, "name": "Maria", "email": "maria@example.com", "role": "manager" }
]
```

- Method: GET
- Route: `/api/v1.0/users/:user_id`
- Descrição: Mostra detalhes de um usuário
- Responses: `200` — user object. Exemplo:
 - Responses: `200` — user object. Exemplo:
```json
{ "id": 42, "name": "Maria", "email": "maria@example.com", "teams": [21], "created_at": "2025-06-01T10:00:00-03:00" }
```

- Method: POST
- Route: `/api/v1.0/users`
- Descrição: Cria um usuário
- Body exemplo:
 - Body exemplo:
```json
{ "user": { "name": "Joao", "email": "joao@example.com", "role": "user" } }
```
- Responses: `201` — created user

- Method: PUT
- Route: `/api/v1.0/users/:id`
- Descrição: Atualiza um usuário
- Responses: `200`

### Users Vacations
- `GET /api/v1.0/users_vacations` — Get user vacations
- `POST /api/v1.0/users/:user_id/vacations` — Create a user vacation
- `GET /api/v1.0/users_vacations/:id` — Show a user vacation
- `PUT /api/v1.0/users_vacations/:id` — Update a user vacation
- `DELETE /api/v1.0/users_vacations/:id` — Destroy a user vacation

### Users Vacations

- Method: GET
- Route: `/api/v1.0/users_vacations`
- Descrição: Lista férias/ausências dos usuários.
- Query params: `user_id`, `year`, `page`, `limit`
- Responses: `200` — array de vacation objects. Exemplo:
 - Responses: `200` — array of vacation objects. Exemplo:
```json
[
  { "id": 901, "user_id": 42, "from": "2026-07-01", "to": "2026-07-10", "reason": "Vacation" }
]
```

- Method: POST
- Route: `/api/v1.0/users/:user_id/vacations`
- Descrição: Cria um período de férias para o usuário
- Body exemplo:
 - Body exemplo:
```json
{ "vacation": { "from": "2026-07-01", "to": "2026-07-10", "reason": "Vacation" } }
```
- Responses: `201`

- Method: GET
- Route: `/api/v1.0/users_vacations/:id`
- Descrição: Recupera um registro de férias
- Responses: `200`

- Method: PUT
- Route: `/api/v1.0/users_vacations/:id`
- Descrição: Atualiza um registro de férias
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/users_vacations/:id`
- Descrição: Remove um registro de férias
- Responses: `204`

### Workflow Elements
- `GET /api/v1.0/workflows/:workflow_id/workflow_elements` — List workflow elements
- `GET /api/v1.0/workflows/:workflow_id/workflow_elements/:id` — Show a workflow element
- `POST /api/v1.0/workflows/:workflow_id/workflow_elements` — Create a workflow element
- `POST /api/v1.0/workflows/:workflow_id/workflow_elements/:id/reorder` — Reorder a workflow element
- `DELETE /api/v1.0/workflows/:workflow_id/workflow_elements/:id` — Destroy a workflow element

### Workflow Elements

- Method: GET
- Route: `/api/v1.0/workflows/:workflow_id/workflow_elements`
- Descrição: Lista elementos (steps) do workflow.
- Responses: `200` — array de workflow_element objects. Exemplo:
```
[
	{ "id": 1001, "workflow_id": 901, "name": "todo", "position": 1 }
]
```

- Method: GET
- Route: `/api/v1.0/workflows/:workflow_id/workflow_elements/:id`
- Descrição: Recupera elemento do workflow
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/workflows/:workflow_id/workflow_elements`
- Descrição: Cria um elemento no workflow
- Body exemplo: `{ "workflow_element": { "name": "qa", "position": 3 } }`
- Responses: `201` — elemento criado

- Method: POST
- Route: `/api/v1.0/workflows/:workflow_id/workflow_elements/:id/reorder`
- Descrição: Reordena elemento dentro do workflow
- Body exemplo: `{ "position": 2 }`
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/workflows/:workflow_id/workflow_elements/:id`
- Descrição: Remove elemento
- Responses: `204`

### Workflows
- `GET /api/v1.0/workflows` — Show a workflow (task or template)
- `POST /api/v1.0/workflows` — Create a workflow
- `DELETE /api/v1.0/workflows` — Destroy a workflow

### Workflows

- Method: GET
- Route: `/api/v1.0/workflows`
- Descrição: Lista workflows; pode filtrar por `subject_type` e `subject_id`.
- Query params: `subject_type`, `subject_id`, `page`, `limit`
- Responses: `200` — array de workflow objects. Exemplo:
```
[
	{ "id": 901, "name": "QA Flow", "subject_type": "Project", "steps_count": 4 }
]
```

- Method: POST
- Route: `/api/v1.0/workflows`
- Descrição: Cria um workflow (associa a projeto/tarefa/template)
- Body exemplo:
```
{ "workflow": { "name": "New Flow", "subject_type": "Project", "subject_id": 800, "steps": ["todo","doing","done"] } }
```
- Responses: `201` — workflow criado. Exemplo:
```
{ "id": 902, "name": "New Flow" }
```

- Method: DELETE
- Route: `/api/v1.0/workflows/:id`
- Descrição: Remove um workflow
- Responses: `204`

## Detalhamento de Endpoints (por grupo)

Formato padrão por método
- **Method:** HTTP verb
- **Route:** path
- **Descrição:** breve
- **Parâmetros (query/path):** lista (nome — descrição — tipo)
- **Body (JSON):** esquema ou exemplo
- **Headers:** obrigatórios (ex.: `App-Key`, `User-Token`, `Content-Type`)
- **cURL:** exemplo mínimo
- **Responses:** status esperados + exemplo JSON

### Activities
- Method: GET
- Route: `/api/v1.0/activities`
- Descrição: Retorna lista de atividades (visível apenas para master users).
- Parâmetros:
	- `sort` — Sort by column (string)
	- `sort_dir` — Sort direction (`asc` or `desc`) (string)
- Headers: `App-Key`, `User-Token`, `Content-Type: application/json`
- cURL:
 - cURL:
```bash
curl -g "https://runrun.it/api/v1.0/activities" -X GET -H "App-Key: YOUR_APP_KEY" -H "User-Token: YOUR_USER_TOKEN"
```
- Responses:
	- `200` — array de activity objects. Exemplo: `[{ "id":1, "trackable_type":"EnterpriseConfiguration", "actor_id":"coyote-776", "actor_name":"Coyote 776", "happened_at":"2026-03-19T18:08:14-03:00", "key":"enterprise_configuration:update", "message": null }]`

### Board Stages
- Method: GET
- Route: `/api/v1.0/boards/:board_id/stages`
- Descrição: Lista estágios de um quadro.
- Parâmetros:
	- `board_id` (path) — id do board (integer)
	- `sort`, `sort_dir`, `search_term`, `stage_group` (query)
- Headers: `App-Key`, `User-Token`
- cURL (list):
```bash
curl -g "https://runrun.it/api/v1.0/boards/1/stages" -H "App-Key:..." -H "User-Token:..."
```
- Responses:
	- `200` — array de board stage objects (fields: `id`, `name`, `stage_group`, `board_id`, `position`, `use_latency_time`, `use_scrum_points`, ...)

- Method: GET
- Route: `/api/v1.0/boards/:board_id/stages/:id`
- Descrição: Retorna um estágio específico.
- Responses:
	- `200` — board stage object

- Method: POST
- Route: `/api/v1.0/boards/:board_id/stages`
- Descrição: Cria um board stage.
- Body:
- Responses:
	- `201` — objeto criado

 - Body:
```json
{ "board_stage": { "name":"My board stage", "stage_group":"opened", "description":"...", "fields_data":[{"field_id":"custom_4"}], "position": 10 } }
```

 - Responses:
	- `201` — objeto criado

- Method: PUT
- Route: `/api/v1.0/boards/:board_id/stages/:id`
- Descrição: Atualiza um board stage (nome, descrição, fields_data)
- Responses:
	- `200` — objeto atualizado

- Method: DELETE
- Route: `/api/v1.0/boards/:board_id/stages/:id`
- Descrição: Remove um board stage
- Responses:
	- `204` — sem conteúdo

- Method: POST
- Route: `/api/v1.0/boards/:board_id/stages/:id/move`
- Descrição: Move estágio para posição em outro grupo
- Body: `{ "position": <integer> }`
- Responses: `200` — objeto atualizado

- Method: POST
- Route: `/api/v1.0/boards/:board_id/stages/:id/update_use_latency_time`
- Body: `{ "use_latency_time": <boolean> }` — Responses: `200`

- Method: POST
- Route: `/api/v1.0/boards/:board_id/stages/:id/update_use_scrum_points`
- Body: `{ "use_scrum_points": <boolean> }` — Responses: `200`

### Checklist Items
- Method: GET
- Route: `/api/v1.0/checklists/:checklist_id/items`
- Descrição: Lista itens do checklist
- Parâmetros:
	- `checklist_id` (path)
- Responses:
	- `200` — array de checklist_item objects (fields: `id`,`description`,`position`,`checked`,`checker_id`,`checked_at`,`checklist_id`)

- Method: GET
- Route: `/api/v1.0/checklists/:checklist_id/items/:id` — details (200)

- Method: POST
- Route: `/api/v1.0/checklists/:checklist_id/items`
- Body:
- Responses: `201` — created object

 - Body:
```json
{ "checklist_item": { "description": "Buy more pencils", "checked": true, "position": 1 } }
```

 - Responses: `201` — created object

- Method: PUT
- Route: `/api/v1.0/checklists/:checklist_id/items/:id` — update fields, Response `200`

- Method: DELETE
- Route: `/api/v1.0/checklists/:checklist_id/items/:id` — Response `204`

### Checklists
- Method: GET
- Route: `/api/v1.0/tasks/:task_id/checklist` — show checklist linked to task
- Method: POST
- Route: `/api/v1.0/tasks/:task_id/checklist`
 - Body:
```json
{ "checklist": { "title": "Office Supplies" } }
```
 - Response `201`
- Method: PUT
- Route: `/api/v1.0/tasks/:task_id/checklist` — update title — Response `200`
- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/checklist` — Response `204`
- Same pattern for `/api/v1.0/task_templates/:task_template_id/checklist` (GET/POST/PUT/DELETE)

### Clients
- Method: GET `/api/v1.0/clients` — query/filter clients (params: `sort`, `sort_dir`, `search_term`, `filter_id`, `is_visible`)
- Method: GET `/api/v1.0/clients/:id` — show client
- Method: POST `/api/v1.0/clients` — create client (body: client fields)
- Method: PUT `/api/v1.0/clients/:id` — update client
- Method: GET `/api/v1.0/clients/:client_id/monthly_budgets` — list budgets
- Method: POST `/api/v1.0/clients/:client_id/update_monthly_budget` — create/update budget

### Comments

- Method: GET
- Route: `/api/v1.0/tasks/:task_id/comments`
- Descrição: Lista comentários de uma tarefa (ordenados por data).
- Parâmetros: `task_id` (path), `page`, `limit`
- Headers: `App-Key`, `User-Token`
- cURL:
 - cURL:
```bash
curl -g "https://runrun.it/api/v1.0/tasks/123/comments" -H "App-Key: YOUR_APP_KEY" -H "User-Token: YOUR_USER_TOKEN"
```
- Responses:

 - Responses:
   - `200` — array de comment objects. Exemplo:
```json
[
  {
    "id": 987,
    "body": "Please update the estimate.",
    "author_id": 42,
    "author_name": "Maria",
    "task_id": 123,
    "created_at": "2026-03-18T14:22:00-03:00",
    "attachments": [],
    "reactions": [{ "kind": "like", "user_id": 55 }]
  }
]
```

- Method: GET
- Route: `/api/v1.0/comments/:id`
- Descrição: Recupera um comentário específico.
- Responses:
	- `200` — comment object. Exemplo:
```
{
	"id": 987,
	"body": "Please update the estimate.",
	"author_id": 42,
	"author_name": "Maria",
	"task_id": 123,
	"created_at": "2026-03-18T14:22:00-03:00",
	"attachments": [],
	"reactions": []
}
```

- Method: POST
- Route: `/api/v1.0/comments`
- Descrição: Cria um comentário (tarefa ou projeto).
- Body exemplo:
```
{ "comment": { "body": "This is a comment", "task_id": 123 } }
```
- Responses:
	- `201` — comment criado. Exemplo:
```
{
	"id": 988,
	"body": "This is a comment",
	"author_id": 42,
	"task_id": 123,
	"created_at": "2026-03-20T10:00:00-03:00"
}
```

- Method: PUT
- Route: `/api/v1.0/comments/:id`
- Descrição: Atualiza o corpo do comentário.
- Body exemplo: `{ "comment": { "body": "Updated text" } }`
- Responses:
	- `200` — comment atualizado (mesmo formato que o GET)

- Method: DELETE
- Route: `/api/v1.0/comments/:id`
- Descrição: Remove um comentário.
- Responses:
	- `204` — sem conteúdo

- Method: POST
- Route: `/api/v1.0/comments/:id/reaction`
- Descrição: Adiciona/atualiza reação a um comentário.
- Body exemplo: `{ "reaction": { "kind": "like" } }`
- Responses:
	- `200` — comentário com lista de reações atualizada. Exemplo parcial:
```
{
	"id": 987,
	"reactions": [{ "kind": "like", "user_id": 55 }]
}
```

### Demanders
- Method: GET
- Route: `/api/v1.0/users/:user_id/demanders`
- Descrição: Lista demanders associados a um usuário.
- Parâmetros: `user_id` (path)
- Headers: `App-Key`, `User-Token`
- Responses: `200` — array de user objects

- Method: POST
- Route: `/api/v1.0/users/:user_id/demanders`
- Descrição: Adiciona um demander ao usuário.
- Body exemplo:
```
{ "demander": { "user_id": 456 } }
```
- Responses: `201`

- Method: POST
- Route: `/api/v1.0/users/:user_id/demanders/replace`
- Descrição: Substitui a lista de demanders do usuário (array de ids).
- Body exemplo:
```
{ "demanders": [123,456,789] }
```
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/users/:user_id/demanders/:id`
- Descrição: Remove um demander do usuário.
- Responses: `204`
Responses examples:

- GET `/api/v1.0/users/:user_id/demanders` — `200`:
```
[
	{ "id": 123, "name": "João Silva", "email": "joao@example.com" },
	{ "id": 456, "name": "Ana Souza", "email": "ana@example.com" }
]
```

- POST `/api/v1.0/users/:user_id/demanders` — `201`:
```
{ "id": 789, "user_id": 456, "owner_id": 12 }
```

- POST `/api/v1.0/users/:user_id/demanders/replace` — `200`:
```
{ "user_id": 12, "demanders": [123,456,789] }
```

### Descendants
- Method: GET
- Route: `/api/v1.0/tasks/:task_id/descendants`
- Descrição: Lista subtarefas/descendentes de uma tarefa.
- Parâmetros: `task_id` (path), `page`, `limit` (query)
- Responses: `200` — array de task objects

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/descendants`
- Descrição: Cria uma subtarefa ligada à tarefa pai.
- Body exemplo:
```
{ "task": { "title": "Subtask title", "estimated_time": 60 } }
```
- Responses: `201`

- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/descendants/:id`
- Descrição: Remove uma subtask
- Responses: `204`
Responses examples:

- GET `/api/v1.0/tasks/:task_id/descendants` — `200`:
```
[
	{ "id": 201, "title": "Subtask A", "parent_id": 100, "status": "open", "assigned_to": null }
]
```

- POST `/api/v1.0/tasks/:task_id/descendants` — `201`:
```
{ "id": 202, "title": "Subtask title", "parent_id": 100, "status": "open" }
```

### Description
- Method: GET
- Route: `/api/v1.0/descriptions`
- Descrição: Consulta descrições por `subject_type` e `subject_id`.
- Query params: `subject_type` (`Project` | `TaskTemplate`), `subject_id` (integer)
- Responses: `200` — array ou object de descriptions

- Method: PUT
- Route: `/api/v1.0/descriptions`
- Descrição: Cria/atualiza uma descrição de projeto ou template.
- Body exemplo:
```
{ "description": { "subject_type": "Project", "subject_id": 123, "body": "Updated description" } }
```
- Responses: `200`
Responses examples:

- GET `/api/v1.0/descriptions?subject_type=Project&subject_id=123` — `200`:
```
{
	"id": 10,
	"subject_type": "Project",
	"subject_id": 123,
	"body": "Project description here",
	"updated_at": "2026-03-10T12:00:00-03:00"
}
```

- PUT `/api/v1.0/descriptions` — `200`:
```
{ "id": 10, "subject_type": "Project", "subject_id": 123, "body": "Updated description" }
```

### Documents
- Method: GET
- Route: `/api/v1.0/tasks/:task_id/documents`
- Descrição: Lista documentos anexados a uma tarefa.
- Parâmetros: `task_id` (path), `page`, `limit`
- Responses: `200` — array de document objects (id, filename, content_type, size, uploader_id, created_at)

- Method: GET
- Route: `/api/v1.0/documents/:id`
- Descrição: Retorna metadados do documento.
- Responses: `200`

- Method: GET
- Route: `/api/v1.0/documents/:id/download`
- Descrição: Faz download do binário do documento (Content-Disposition: attachment).

- Method: GET
- Route: `/api/v1.0/documents/:id/thumbnail`
- Descrição: Retorna thumbnail do documento (quando aplicável).

- Method: GET
- Route: `/api/v1.0/documents/:id/preview`
- Descrição: Retorna preview do documento.

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/documents`
- Descrição: Faz upload/cria documento na tarefa. Aceita `multipart/form-data`.
- cURL exemplo:
 - cURL exemplo:
```bash
curl -X POST "https://runrun.it/api/v1.0/tasks/123/documents" \
	-H "App-Key: YOUR_APP_KEY" -H "User-Token: YOUR_USER_TOKEN" \
	-F "file=@/path/to/file.pdf"
```
- Responses: `201` — document criado (metadados)

- Method: POST
- Route: `/api/v1.0/documents/:id/mark_as_uploaded`
- Descrição: Marca documento como enviado (fluxo de upload em etapas).
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/documents/:id`
- Descrição: Remove documento e arquivos associados.
- Responses: `204`
Responses examples:

- GET `/api/v1.0/tasks/:task_id/documents` — `200`:
```json
[
  {
    "id": 501,
    "filename": "report.pdf",
    "content_type": "application/pdf",
    "size": 234567,
    "uploader_id": 42,
    "created_at": "2026-03-01T09:00:00-03:00"
  }
]
```

- GET `/api/v1.0/documents/:id` — `200`:
```json
{
  "id": 501,
  "filename": "report.pdf",
  "content_type": "application/pdf",
  "size": 234567,
  "uploader_id": 42,
  "created_at": "2026-03-01T09:00:00-03:00",
  "url": "https://runrun.it/documents/501/download"
}
```

- POST `/api/v1.0/tasks/:task_id/documents` — `201`:
```json
{
  "id": 501,
  "filename": "report.pdf",
  "content_type": "application/pdf",
  "size": 234567,
  "uploader_id": 42,
  "created_at": "2026-03-01T09:00:00-03:00",
  "uploaded": true
}
```

- POST `/api/v1.0/documents/:id/mark_as_uploaded` — `200`:
```json
{ "id": 501, "uploaded": true }
```

- DELETE `/api/v1.0/documents/:id` — `204` — sem conteúdo


### Enterprises

- Method: GET
- Route: `/api/v1.0/enterprises/:id`
- Descrição: Retorna detalhes da conta (enterprise).
- Responses:
	- `200` — enterprise object. Exemplo:
```json
{
  "id": 1,
  "name": "Acme Corp",
  "timezone": "America/Sao_Paulo",
  "currency": "BRL",
  "subscription_plan": "business",
  "created_at": "2024-01-10T08:00:00-03:00",
  "admins": [{ "id": 12, "name": "Admin User" }]
}
```

- Method: PUT
- Route: `/api/v1.0/enterprises/:id`
- Descrição: Atualiza informações da enterprise.
- Body exemplo:
```
{ "enterprise": { "name": "New Name", "timezone": "UTC" } }
```
- Responses: `200` — enterprise atualizado (mesmo formato que o GET)

### Estimates

- Method: GET
- Route: `/api/v1.0/tasks/:task_id/estimates`
- Descrição: Lista estimativas de uma tarefa.
- Responses:
	- `200` — array de estimate objects. Exemplo:
```json
[
  { "id": 301, "task_id": 123, "hours": 4, "cost": 200, "author_id": 42, "created_at": "2026-02-15T10:00:00-03:00" }
]
```

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/estimates`
- Descrição: Cria uma estimate para a tarefa.
- Body exemplo:
```
{ "estimate": { "hours": 5, "cost": 250 } }
```
- Responses:
	- `201` — estimate criado. Exemplo:
```
{ "id": 302, "task_id": 123, "hours": 5, "cost": 250, "author_id": 42 }
```

### EventNotification

- Method: GET
- Route: `/api/v1.0/users/:user_id/event_notifications`
- Descrição: Lista notificações de eventos para um usuário.
- Query params: `only_unread` (boolean), `page`, `limit`
- Responses:
	- `200` — array de event_notification objects. Exemplo:
```json
[
  {
    "id": 701,
    "user_id": 42,
    "event_key": "task:update",
    "payload": { "task_id": 123, "changed_fields": ["status"] },
    "read_at": null,
    "created_at": "2026-03-19T20:00:00-03:00"
  }
]
```

- Method: POST
- Route: `/api/v1.0/users/:user_id/event_notifications/:id/mark_as_read`
- Descrição: Marca notificação como lida.
- Responses: `200` — notificação atualizada. Exemplo:
```json
{ "id": 701, "read_at": "2026-03-20T09:00:00-03:00" }
```

- Method: POST
- Route: `/api/v1.0/users/:user_id/event_notifications/mark_all_as_read`
- Descrição: Marca todas as notificações do usuário como lidas.
- Responses: `200` — resumo. Exemplo:
```json
{ "marked_count": 5 }
```

- Method: DELETE
- Route: `/api/v1.0/users/:user_id/event_notifications/:id`
- Descrição: Remove uma notificação.
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/users/:user_id/event_notifications/destroy_all`
- Descrição: Remove todas as notificações do usuário.
- Responses: `200` — resumo. Exemplo:
```json
{ "destroyed_count": 12 }
```

### Filters

- Method: GET
- Route: `/api/v1.0/projects/filters`
- Descrição: Lista filtros de projeto visíveis ao usuário.
- Responses: `200` — array de filter objects. Exemplo:
```json
[
  { "id": 810, "name": "Recently Updated", "scope": "project", "query": "status:open" }
]
```

- Method: GET
- Route: `/api/v1.0/projects/filters/:id`
- Descrição: Retorna detalhes do filtro.
- Responses: `200` — filter object. Exemplo:
```
{ "id": 810, "name": "Recently Updated", "scope": "project", "query": "status:open", "created_by": 12 }
```

- Method: DELETE
- Route: `/api/v1.0/projects/filters/:id`
- Descrição: Remove um filtro.
- Responses: `204`

- Method: GET
- Route: `/api/v1.0/tasks/filters`
- Descrição: Lista filtros de tarefas.
- Responses: `200` — array de filter objects

- Method: GET
- Route: `/api/v1.0/tasks/filters/:id`
- Descrição: Retorna filtro de tarefas.
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/tasks/filters/:id`
- Descrição: Remove filtro de tarefas.
- Responses: `204`

### Manual Work Periods

- Method: GET
- Route: `/api/v1.0/manual_work_periods`
- Descrição: Lista períodos de trabalho manuais registrados.
- Query params: `user_id`, `page`, `limit`
- Responses: `200` — array de manual_work_period objects. Exemplo:
```json
[
  { "id": 401, "user_id": 42, "started_at": "2026-03-19T09:00:00-03:00", "ended_at": "2026-03-19T11:00:00-03:00", "notes": "Meeting" }
]
```

- Method: GET
- Route: `/api/v1.0/manual_work_periods/:id`
- Descrição: Recupera um período manual específico.
- Responses: `200` — manual_work_period object.

- Method: POST
- Route: `/api/v1.0/manual_work_periods`
- Descrição: Cria um período de trabalho manual.
- Body exemplo:
```
{ "manual_work_period": { "user_id": 42, "started_at": "2026-03-19T09:00:00-03:00", "ended_at": "2026-03-19T11:00:00-03:00", "notes": "Meeting" } }
```
- Responses: `201` — objeto criado

- Method: PUT
- Route: `/api/v1.0/manual_work_periods/:id`
- Descrição: Atualiza um período manual.
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/manual_work_periods/:id`
- Descrição: Remove um período manual.
- Responses: `204`

### OffDays

- Method: GET
- Route: `/api/v1.0/off_days`
- Descrição: Lista feriados / dias off configurados.
- Query params: `year`, `page`, `limit`
- Responses: `200` — array de off_day objects. Exemplo:
```json
[
  { "id": 601, "date": "2026-12-25", "name": "Natal" }
]
```

- Method: GET
- Route: `/api/v1.0/off_days/:id`
- Descrição: Recupera um off day
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/off_days`
- Descrição: Cria um off day
- Body exemplo:
```
{ "off_day": { "date": "2026-12-25", "name": "Natal" } }
```
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/off_days/:id`
- Descrição: Atualiza um off day
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/off_days/:id`
- Descrição: Remove um off day
- Responses: `204`

### Partners

- Method: GET
- Route: `/api/v1.0/users/:user_id/partners`
- Descrição: Lista parceiros/colaboradores associados a um usuário.
- Responses: `200` — array de partner objects. Exemplo:
```json
[
  { "id": 711, "user_id": 42, "partner_id": 88, "partner_name": "Carlos" }
]
```

- Method: POST
- Route: `/api/v1.0/users/:user_id/partners`
- Descrição: Adiciona um parceiro ao usuário
- Body exemplo:
```
{ "partner": { "partner_id": 88 } }
```
- Responses: `201` — relação criada

- Method: POST
- Route: `/api/v1.0/users/:user_id/partners/replace`
- Descrição: Substitui lista de parceiros
- Body exemplo: `{ "partners": [88,99] }`
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/users/:user_id/partners/:id`
- Descrição: Remove parceiro
- Responses: `204`

### Prerequisites

- Method: GET
- Route: `/api/v1.0/tasks/:task_id/prerequisites`
- Descrição: Lista requisitos/prerequisitos para completar uma tarefa.
- Responses: `200` — array de prerequisites. Exemplo:
```json
[
  { "id": 821, "task_id": 200, "prerequisite_task_id": 150 }
]
```

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/prerequisites`
- Descrição: Adiciona um prerequisite
- Body exemplo:
```
{ "prerequisite": { "prerequisite_task_id": 150 } }
```
- Responses: `201` — criado

- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/prerequisites/:id`
- Descrição: Remove prerequisite
- Responses: `204`

### Project Description

- Method: PUT
- Route: `/api/v1.0/projects/:project_id/description`
- Descrição: Atualiza a descrição de um projeto
- Body exemplo:
```
{ "description": { "body": "Project long description here" } }
```
- Responses:
	- `200` — description atualizado. Exemplo:
```
{ "id": 10, "subject_type": "Project", "subject_id": 123, "body": "Project long description here" }
```

### Justifications

- Method: POST
- Route: `/api/v1.0/justifications`
- Descrição: Cria uma justificativa (geral ou ligada a uma tarefa).
- Body exemplo:
```
{ "justification": { "text": "Reason for change", "task_id": 123 } }
```
- Responses:
	- `201` — justification criado. Exemplo:
```json
{ "id": 901, "text": "Reason for change", "task_id": 123, "author_id": 42, "created_at": "2026-03-20T08:30:00-03:00" }
```

- Method: PUT
- Route: `/api/v1.0/justifications/:justification_id`
- Descrição: Atualiza o texto da justificativa.
- Body exemplo: `{ "justification": { "text": "Updated reason" } }`
- Responses: `200` — justification atualizado

### Project Groups

- Method: GET
- Route: `/api/v1.0/clients/:client_id/project_groups`
- Descrição: Lista grupos de projeto pertencentes a um cliente.
- Responses: `200` — array de project_group objects. Exemplo:
```json
[
  { "id": 401, "client_id": 55, "name": "Website", "created_at": "2025-10-01T09:00:00-03:00" }
]
```

- Method: GET
- Route: `/api/v1.0/clients/:client_id/project_groups/:id`
- Descrição: Recupera um project group
- Responses: `200` — project_group object

- Method: POST
- Route: `/api/v1.0/clients/:client_id/project_groups`
- Descrição: Cria um project group para o cliente
- Body exemplo:
```
{ "project_group": { "name": "New Group" } }
```
- Responses: `201` — objeto criado

- Method: PUT
- Route: `/api/v1.0/clients/:client_id/project_groups/:id`
- Descrição: Atualiza o project group
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/clients/:client_id/project_groups/:id`
- Descrição: Remove um project group
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/project_groups/:id/move`
- Descrição: Move o project group para outro cliente
- Body exemplo: `{ "client_id": 99 }`
- Responses: `200` — project_group atualizado

### Project Sub Groups

- Method: GET
- Route: `/api/v1.0/project_groups/:project_group_id/project_sub_groups`
- Descrição: Lista sub-groups do project_group
- Responses: `200` — array de project_sub_group objects. Exemplo:
```json
[
  { "id": 501, "project_group_id": 401, "name": "Frontend" }
]
```

- Method: GET
- Route: `/api/v1.0/clients/:client_id/project_sub_groups`
- Descrição: Lista sub-groups por cliente
- Responses: `200`

- Method: GET
- Route: `/api/v1.0/project_groups/:project_group_id/project_sub_groups/:id`
- Descrição: Recupera sub-group
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/project_groups/:project_group_id/project_sub_groups`
- Descrição: Cria um project sub group
- Body exemplo:
```
{ "project_sub_group": { "name": "Backend" } }
```
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/project_groups/:project_group_id/project_sub_groups/:id`
- Descrição: Atualiza um sub-group
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/project_groups/:project_group_id/project_sub_groups/:id`
- Descrição: Remove um sub-group
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/project_sub_groups/:id/move`
- Descrição: Move sub-group para outro project_group
- Body exemplo: `{ "project_group_id": 402 }`
- Responses: `200`

### Project Templates

- Method: GET
- Route: `/api/v1.0/project_templates`
- Descrição: Lista templates de projeto
- Responses: `200` — array de project_template objects. Exemplo:
```json
[
  { "id": 601, "name": "Standard Website", "created_by": 12 }
]
```

- Method: GET
- Route: `/api/v1.0/project_templates/:id`
- Descrição: Recupera template de projeto
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/project_templates`
- Descrição: Cria um project template
- Body exemplo:
```
{ "project_template": { "name": "New Template", "tasks_attributes": [{ "title": "Task 1" }] } }
```
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/project_templates/:id`
- Descrição: Atualiza um project template
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/project_templates/:id`
- Descrição: Remove um template
- Responses: `204`

### Project Extra Cost

- Method: GET
- Route: `/api/v1.0/projects/:project_id/extra_costs`
- Descrição: Lista custos extras de um projeto
- Responses: `200` — array de extra_cost objects. Exemplo:
```json
[
  { "id": 701, "project_id": 800, "description": "License", "amount": 150 }
]
```

- Method: GET
- Route: `/api/v1.0/projects/:project_id/extra_costs/:id`
- Descrição: Recupera um extra cost
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/projects/:project_id/extra_costs`
- Descrição: Cria um custo extra para o projeto
- Body exemplo:
```
{ "extra_cost": { "description": "License", "amount": 150 } }
```
- Responses: `201`

### Projects

- Method: GET
- Route: `/api/v1.0/projects`
- Descrição: Lista projetos com filtros e paginação
- Query params: `client_id`, `project_group_id`, `status`, `page`, `limit`
- Responses: `200` — array de project objects. Exemplo:
```json
[
  { "id": 800, "name": "Website Revamp", "client_id": 55, "status": "active", "start_date": "2026-01-01", "end_date": null }
]
```

- Method: GET
- Route: `/api/v1.0/projects/:id`
- Descrição: Mostra detalhes do projeto
- Responses: `200` — project object. Exemplo:
```json
{
  "id": 800,
  "name": "Website Revamp",
  "client_id": 55,
  "project_group_id": 401,
  "status": "active",
  "start_date": "2026-01-01",
  "end_date": null,
  "budget": { "hours": 200, "cost": 15000 }
}
```

- Method: POST
- Route: `/api/v1.0/projects/`
- Descrição: Cria um projeto
- Body exemplo:
```
{ "project": { "name": "New Project", "client_id": 55, "project_group_id": 401 } }
```
- Responses: `201` — project criado

- Method: PUT
- Route: `/api/v1.0/projects/:id`
- Descrição: Atualiza ou realiza ações sobre projeto (deliver, change stage, etc.)
- Body: varia conforme a ação — ver rotas específicas
- Responses: `200` / `204` conforme ação

- Method: POST
- Route: `/api/v1.0/projects/:id/move`
- Descrição: Move projeto entre cliente / grupo / sub-group
- Body exemplo: `{ "client_id": 99, "project_group_id": 402 }`
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/projects/:id/share`
- Descrição: Compartilha projeto com outro usuário
- Body exemplo: `{ "user_id": 77 }`
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/projects/:id/unshare`
- Descrição: Remove compartilhamento
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/projects/:id/clone`
- Descrição: Clona um projeto
- Responses: `201` — novo projeto criado (ex.: `{ "id": 801 }`)

- Method: POST
- Route: `/api/v1.0/projects/:id/change_board_stage`
- Descrição: Altera board stage do projeto
- Body exemplo: `{ "board_stage_id": 10 }`
- Responses: `200`

### Tags

- Method: GET
- Route: `/api/v1.0/tags`
- Descrição: Lista tags usadas no workspace; suporta `search_term` e paginação.
- Responses: `200` — array de tag objects. Exemplo:
```json
[
  { "id": 1, "name": "urgent", "usage_count": 123 }
]
```

- Method: POST
- Route: `/api/v1.0/tags`
- Descrição: Cria uma tag global.
- Body exemplo: `{ "tag": { "name": "support" } }`
- Responses: `201` — tag criada

### Task Description

- Method: GET
- Route: `/api/v1.0/tasks/:task_id/description`
- Descrição: Mostra descrição longa da tarefa.
- Responses: `200` — description object. Exemplo:
```json
{ "id": 11, "subject_type": "Task", "subject_id": 123, "body": "Detalhes da tarefa" }
```

- Method: PUT
- Route: `/api/v1.0/tasks/:task_id/description`
- Descrição: Atualiza a descrição da tarefa.
- Body exemplo: `{ "description": { "body": "Nova descrição" } }`
- Responses: `200` — description atualizado

### Task Evaluations

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/evaluations`
- Descrição: Adiciona/atualiza avaliação(es) de uma tarefa (ex.: performance, quality).
- Body exemplo:
```
{ "evaluations": [{ "evaluator_id": 42, "score": 4, "note": "Good" }] }
```
- Responses: `200` — array de evaluations atualizadas. Exemplo:
```json
[
  { "id": 301, "task_id": 123, "evaluator_id": 42, "score": 4, "note": "Good" }
]
```

- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/evaluations`
- Descrição: Remove todas as avaliações de uma tarefa.
- Responses: `204`

### Task Followers

- Method: GET
- Route: `/api/v1.0/tasks/:task_id/followers`
- Descrição: Lista usuários que seguem a tarefa.
- Responses: `200` — array de followers. Exemplo:
```json
[
  { "id": 501, "user_id": 42, "user_name": "Maria" }
]
```

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/followers`
- Descrição: Adiciona um follower à tarefa.
- Body exemplo: `{ "follower": { "user_id": 55 } }`
- Responses: `201` — follower criado

- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/followers/:id`
- Descrição: Remove follower
- Responses: `204`

### Task Templates

- Method: GET
- Route: `/api/v1.0/project_templates/:project_template_id/task_templates`
- Descrição: Lista task templates de um project template.
- Responses: `200` — array de task_template objects. Exemplo:
```json
[
  { "id": 601, "title": "Design Review", "estimated_time": 120 }
]
```

- Method: GET
- Route: `/api/v1.0/project_templates/:project_template_id/task_templates/:id`
- Descrição: Recupera um task template
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/project_templates/:project_template_id/task_templates`
- Descrição: Cria um task template dentro do project template.
- Body exemplo:
```
{ "task_template": { "title": "QA", "estimated_time": 60 } }
```
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/project_templates/:project_template_id/task_templates/:id`
- Descrição: Atualiza um task template
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/project_templates/:project_template_id/task_templates/:id`
- Descrição: Remove um task template
- Responses: `204`

### Task Workflows

- Method: GET
- Route: `/api/v1.0/workflows`
- Descrição: Lista workflows (task ou template) com paginação e filtro por `subject_type`.
- Query params: `subject_type` (`Task` | `TaskTemplate`), `page`, `limit`
- Responses: `200` — array de workflow objects. Exemplo:
```json
[
  { "id": 901, "subject_type": "Task", "subject_id": 123, "name": "QA Flow", "steps": ["todo","in_progress","done"] }
]
```

### Task Assignments

- Method: DELETE
- Route: `/api/v1.0/tasks/:task_id/assignments/:id`
- Descrição: Remove uma assignment (atribuição) de tarefa.
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/play`
- Descrição: Inicia a assignment (play).
- Responses: `200` — assignment atualizado. Exemplo:
```json
{ "id": 1101, "task_id": 123, "user_id": 42, "status": "playing", "started_at": "2026-03-20T09:00:00-03:00" }
```

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/pause`
- Descrição: Pausa a assignment
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/deliver`
- Descrição: Marca assignment como entregue
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/reopen`
- Descrição: Reabre assignment
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/reposition`
- Descrição: Reposiciona assignment na fila/board
- Body exemplo: `{ "position": 1 }`
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:task_id/assignments/:id/reestimate`
- Descrição: Atualiza estimativa da assignment
- Body exemplo: `{ "estimated_time": 120 }`
- Responses: `200`

### Task Types

- Method: GET
- Route: `/api/v1.0/task_types`
- Descrição: Lista tipos de tarefa (ex.: bug, feature).
- Responses: `200` — array de task_type objects. Exemplo:
```json
[
  { "id": 1, "name": "bug", "default_estimate": 60 }
]
```

- Method: GET
- Route: `/api/v1.0/task_types/:id`
- Descrição: Recupera um tipo de tarefa
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/task_types`
- Descrição: Cria um task type
- Body exemplo: `{ "task_type": { "name": "research", "default_estimate": 120 } }`
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/task_types/:id`
- Descrição: Atualiza um task type
- Responses: `200`

### Tasks

- Method: GET
- Route: `/api/v1.0/tasks`
- Descrição: Consulta tarefas com filtros e paginação.
- Query params: `project_id`, `assignee_id`, `status`, `tags[]`, `page`, `limit`, `sort`
- Responses: `200` — array de task objects. Exemplo:
```json
[
  { "id": 123, "title": "Fix login bug", "status": "open", "assignee_id": 42, "project_id": 800 }
]
```

- Method: GET
- Route: `/api/v1.0/tasks/:id`
- Descrição: Mostra detalhes da tarefa
- Responses: `200` — task object. Exemplo:
```json
{
  "id": 123,
  "title": "Fix login bug",
  "description": "Steps to reproduce...",
  "status": "open",
  "assignee_id": 42,
  "created_at": "2026-03-01T10:00:00-03:00",
  "points": 3,
  "tags": ["bug","urgent"]
}
```

- Method: GET
- Route: `/api/v1.0/tasks/:id/subtasks`
- Descrição: Lista subtarefas
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks`
- Descrição: Cria uma tarefa
- Body exemplo:
```
{ "task": { "title": "New task", "project_id": 800, "assignee_id": 42 } }
```
- Responses: `201` — task criado

- Method: PUT
- Route: `/api/v1.0/tasks/:id`
- Descrição: Atualiza campos da tarefa (title, dates, points, fields, tags)
- Body exemplo: `{ "task": { "title": "Updated" } }`
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/tasks/:id`
- Descrição: Remove uma tarefa
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/tasks/:id/play`
- Descrição: Cria assignment e inicia o trabalho
- Responses: `200` — assignment info

- Method: POST
- Route: `/api/v1.0/tasks/:id/pause`
- Descrição: Pausa a tarefa/assignment
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:id/deliver`
- Descrição: Entrega a tarefa
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:id/reopen`
- Descrição: Reabre a tarefa
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/tasks/:id/move`
- Descrição: Move tarefa para outro estágio/board. Body exemplo: `{ "stage_id": 10, "position": 1 }`
- Responses: `200`

### Teams

- Method: GET
- Route: `/api/v1.0/teams`
- Descrição: Lista times com paginação
- Responses: `200` — array de team objects. Exemplo:
```json
[
  { "id": 21, "name": "Design", "members_count": 5 }
]
```

- Method: GET
- Route: `/api/v1.0/teams/:id`
- Descrição: Mostra detalhes do time
- Responses: `200` — team object. Exemplo:
```json
{ "id": 21, "name": "Design", "members": [{ "id": 42, "name": "Maria" }] }
```

- Method: POST
- Route: `/api/v1.0/teams`
- Descrição: Cria um time
- Body exemplo: `{ "team": { "name": "New Team" } }`
- Responses: `201`

- Method: PUT
- Route: `/api/v1.0/teams/:id`
- Descrição: Atualiza o team
- Responses: `200`

- Method: DELETE
- Route: `/api/v1.0/teams/:id`
- Descrição: Remove um time
- Responses: `204`

- Method: POST
- Route: `/api/v1.0/teams/:id/add_member`
- Descrição: Adiciona usuário ao time
- Body exemplo: `{ "user_id": 42 }`
- Responses: `200`

- Method: POST
- Route: `/api/v1.0/teams/:id/remove_member`
- Descrição: Remove usuário do time
- Body exemplo: `{ "user_id": 42 }`
- Responses: `200`

### Time Worked / Users / Users Vacations
 - Seguir o template: incluir exemplos de cURL, parâmetros path/query, esquema de body e respostas comuns (200/201/204/400/404).

### Workflow Elements / Workflows
 - Endpoints listados no sumário, detalhar bodies para criação/atualização de elementos de workflow quando necessário.

Observação final: preenchi o documento com o template detalhado e popular exemplos para os grupos cujos dados completos já aparecem em `intergra.txt` (Activities, Board Stages, Checklist Items, Checklists, Clients, Documents, etc.). Posso agora:
- (A) Preencher exemplos JSON de resposta completos para todos endpoints (grande volume), ou
- (B) Iterar por grupos em lotes (ex.: 5 grupos por vez) e preencher detalhadamente cada rota.


 

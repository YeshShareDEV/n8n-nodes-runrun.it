# API Runrun.it

URL base: `/api/v1.0/`

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
	- `RateLimit-Limit` — limite de requests
	- `RateLimit-Remaining` — requests restantes
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

### Atividades (Activities)
- `GET /api/v1.0/activities` — Obter atividades

### Estágios do Quadro (Board Stages)
- `GET /api/v1.0/boards/:board_id/stages` — Listar todos os estágios do quadro
- `GET /api/v1.0/boards/:board_id/stages/:id` — Mostrar um estágio do quadro
- `POST /api/v1.0/boards/:board_id/stages` — Criar um estágio do quadro
- `PUT /api/v1.0/boards/:board_id/stages/:id` — Atualizar um estágio do quadro
- `DELETE /api/v1.0/boards/:board_id/stages/:id` — Excluir um estágio do quadro
- `POST /api/v1.0/boards/:board_id/stages/:id/move` — Mover um estágio para outra posição de grupo
- `POST /api/v1.0/boards/:board_id/stages/:id/update_use_latency_time` — Atualizar para usar (ou não) tempo de latência
- `POST /api/v1.0/boards/:board_id/stages/:id/update_use_scrum_points` — Atualizar para usar (ou não) pontos scrum

### Itens de Checklist (Checklist Items)
- `GET /api/v1.0/checklists/:checklist_id/items` — Listar itens do checklist
- `GET /api/v1.0/checklists/:checklist_id/items/:id` — Mostrar um item do checklist
- `POST /api/v1.0/checklists/:checklist_id/items` — Criar um item de checklist
- `PUT /api/v1.0/checklists/:checklist_id/items/:id` — Atualizar um item do checklist
- `DELETE /api/v1.0/checklists/:checklist_id/items/:id` — Excluir um item do checklist

### Checklists
- `GET /api/v1.0/tasks/:task_id/checklist` — Mostrar checklist de uma tarefa
- `POST /api/v1.0/tasks/:task_id/checklist` — Criar checklist a partir de uma tarefa
- `PUT /api/v1.0/tasks/:task_id/checklist` — Atualizar checklist de uma tarefa
- `DELETE /api/v1.0/tasks/:task_id/checklist` — Excluir checklist de uma tarefa
- `GET /api/v1.0/task_templates/:task_template_id/checklist` — Mostrar checklist de um template
- `POST /api/v1.0/task_templates/:task_template_id/checklist` — Criar checklist a partir de um template
- `PUT /api/v1.0/task_templates/:task_template_id/checklist` — Atualizar checklist do template
- `DELETE /api/v1.0/task_templates/:task_template_id/checklist` — Excluir checklist do template

### Clientes (Clients)
- `GET /api/v1.0/clients` — Listar clientes
- `GET /api/v1.0/clients/:id` — Mostrar um cliente
- `POST /api/v1.0/clients` — Criar um cliente
- `PUT /api/v1.0/clients/:id` — Atualizar um cliente
- `GET /api/v1.0/clients/:client_id/monthly_budgets` — Listar orçamentos mensais
- `POST /api/v1.0/clients/:client_id/update_monthly_budget` — Criar/atualizar orçamento mensal

### Comentários (Comments)
- `GET /api/v1.0/tasks/:task_id/comments` — Listar comentários de uma tarefa
- `GET /api/v1.0/comments/:id` — Mostrar um comentário específico
- `POST /api/v1.0/comments` — Criar um comentário de tarefa ou projeto
- `PUT /api/v1.0/comments/:id` — Atualizar um comentário
- `DELETE /api/v1.0/comments/:id` — Excluir um comentário
- `POST /api/v1.0/comments/:id/reaction` — Reagir a um comentário

### Demandantes (Demanders)
- `GET /api/v1.0/users/:user_id/demanders` — Listar todos os demandantes de um usuário
- `POST /api/v1.0/users/:user_id/demanders` — Adicionar um demandante a um usuário
- `POST /api/v1.0/users/:user_id/demanders/replace` — Substituir lista de demandantes do usuário
- `DELETE /api/v1.0/users/:user_id/demanders/:id` — Remover um demandante do usuário

### Descendentes (Descendants)
- `GET /api/v1.0/tasks/:task_id/descendants` — Listar descendentes de uma tarefa
- `POST /api/v1.0/tasks/:task_id/descendants` — Adicionar uma sub-tarefa
- `DELETE /api/v1.0/tasks/:task_id/descendants/:id` — Remover um descendente

### Descrições (Description)
- `GET /api/v1.0/descriptions` — Consultar descrições (vários/um)
- `PUT /api/v1.0/descriptions` — Atualizar descrição de projeto ou template

### Documentos (Documents)
- `GET /api/v1.0/tasks/:task_id/documents` — Listar documentos de uma tarefa
- `GET /api/v1.0/documents/:id` — Mostrar um documento
- `GET /api/v1.0/documents/:id/download` — Baixar documento
- `GET /api/v1.0/documents/:id/thumbnail` — Baixar thumbnail
- `GET /api/v1.0/documents/:id/preview` — Baixar preview
- `POST /api/v1.0/tasks/:task_id/documents` — Criar um documento (upload)
- `POST /api/v1.0/documents/:id/mark_as_uploaded` — Marcar documento como enviado
- `DELETE /api/v1.0/documents/:id` — Excluir documento
- `GET /api/v1.0/documents/download_zip` — Baixar múltiplos documentos em zip

### Enterprises
- `GET /api/v1.0/enterprises/:id` — Mostrar detalhes da enterprise
- `PUT /api/v1.0/enterprises/:id` — Atualizar enterprise

### Estimates
- `GET /api/v1.0/tasks/:task_id/estimates` — Mostrar estimativas de uma tarefa
- `POST /api/v1.0/tasks/:task_id/estimates` — Criar uma estimativa para a tarefa

### EventNotification
- `GET /api/v1.0/users/:user_id/event_notifications` — Listar notificações de eventos do usuário
- `POST /api/v1.0/users/:user_id/event_notifications/:id/mark_as_read` — Marcar notificação como lida
- `POST /api/v1.0/users/:user_id/event_notifications/mark_all_as_read` — Marcar todas como lidas
- `DELETE /api/v1.0/users/:user_id/event_notifications/:id` — Excluir uma notificação
- `POST /api/v1.0/users/:user_id/event_notifications/destroy_all` — Excluir todas notificações

### Filters (Filtros)
- `GET /api/v1.0/projects/filters` — Listar filtros de projeto
- `GET /api/v1.0/projects/filters/:id` — Mostrar filtro de projeto
- `DELETE /api/v1.0/projects/filters/:id` — Excluir filtro
- `GET /api/v1.0/tasks/filters` — Listar filtros de tarefas
- `GET /api/v1.0/tasks/filters/:id` — Mostrar filtro de tarefa
- `DELETE /api/v1.0/tasks/filters/:id` — Excluir filtro de tarefa

### Justificativas (Justifications)
- `POST /api/v1.0/justifications` — Criar uma justificativa
- `PUT /api/v1.0/justifications/:justification_id` — Atualizar justificativa

### Períodos Manuais de Trabalho (Manual Work Periods)
- `GET /api/v1.0/manual_work_periods` — Listar períodos manuais
- `GET /api/v1.0/manual_work_periods/:id` — Mostrar período manual
- `POST /api/v1.0/manual_work_periods` — Criar período manual
- `PUT /api/v1.0/manual_work_periods/:id` — Atualizar período manual
- `DELETE /api/v1.0/manual_work_periods/:id` — Excluir período manual

### Dias Off (OffDays)
- `GET /api/v1.0/off_days` — Listar dias off
- `GET /api/v1.0/off_days/:id` — Mostrar dia off
- `POST /api/v1.0/off_days` — Criar dia off
- `PUT /api/v1.0/off_days/:id` — Atualizar dia off
- `DELETE /api/v1.0/off_days/:id` — Excluir dia off

### Parceiros (Partners)
- `GET /api/v1.0/users/:user_id/partners` — Listar parceiros de um usuário
- `POST /api/v1.0/users/:user_id/partners` — Adicionar parceiro
- `POST /api/v1.0/users/:user_id/partners/replace` — Substituir lista de parceiros
- `DELETE /api/v1.0/users/:user_id/partners/:id` — Remover parceiro

### Pré-requisitos (Prerequisites)
- `GET /api/v1.0/tasks/:task_id/prerequisites` — Listar pré-requisitos de uma tarefa
- `POST /api/v1.0/tasks/:task_id/prerequisites` — Adicionar pré-requisito
- `DELETE /api/v1.0/tasks/:task_id/prerequisites/:id` — Remover pré-requisito

### Descrição do Projeto (Project Description)
- `PUT /api/v1.0/projects/:project_id/description` — Atualizar descrição do projeto

### Grupos de Projeto (Project Groups)
- `GET /api/v1.0/clients/:client_id/project_groups` — Listar project groups de um cliente
- `GET /api/v1.0/clients/:client_id/project_groups/:id` — Mostrar project group
- `POST /api/v1.0/clients/:client_id/project_groups` — Criar project group
- `PUT /api/v1.0/clients/:client_id/project_groups/:id` — Atualizar project group
- `DELETE /api/v1.0/clients/:client_id/project_groups/:id` — Excluir project group
- `POST /api/v1.0/project_groups/:id/move` — Mover project group para outro cliente

### Subgrupos de Projeto (Project Sub Groups)
- `GET /api/v1.0/project_groups/:project_group_id/project_sub_groups` — Listar subgrupos
- `GET /api/v1.0/clients/:client_id/project_sub_groups` — Listar subgrupos por cliente
- `GET /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Mostrar subgrupo
- `POST /api/v1.0/project_groups/:project_group_id/project_sub_groups` — Criar subgrupo
- `PUT /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Atualizar subgrupo
- `DELETE /api/v1.0/project_groups/:project_group_id/project_sub_groups/:id` — Excluir subgrupo
- `POST /api/v1.0/project_sub_groups/:id/move` — Mover subgrupo

### Templates de Projeto (Project Templates)
- `GET /api/v1.0/project_templates` — Listar templates
- `GET /api/v1.0/project_templates/:id` — Mostrar template
- `POST /api/v1.0/project_templates/` — Criar template
- `PUT /api/v1.0/project_templates/:id` — Atualizar template
- `DELETE /api/v1.0/project_templates/:id` — Excluir template

### Custos Extras do Projeto (Project Extra Cost)
- `GET /api/v1.0/projects/:project_id/extra_costs` — Listar custos extras
- `GET /api/v1.0/projects/:project_id/extra_costs/:id` — Mostrar custo extra
- `POST /api/v1.0/projects/:project_id/extra_costs` — Criar custo extra

### Projetos (Projects)
- `GET /api/v1.0/projects` — Listar projetos
- `GET /api/v1.0/projects/:id` — Mostrar projeto
- `POST /api/v1.0/projects/` — Criar projeto
- `PUT /api/v1.0/projects/:id` — Atualizar projeto
- `POST /api/v1.0/projects/:id/move` — Mover projeto
- `POST /api/v1.0/projects/:id/share` — Compartilhar projeto
- `POST /api/v1.0/projects/:id/unshare` — Remover compartilhamento
- `POST /api/v1.0/projects/:id/clone` — Clonar projeto
- `POST /api/v1.0/projects/:id/change_board_stage` — Alterar estágio do board do projeto

### Tags
- `GET /api/v1.0/tags` — Consultar tags
- `POST /api/v1.0/tags` — Criar tag

### Descrição da Tarefa (Task Description)
- `GET /api/v1.0/tasks/:task_id/description` — Mostrar descrição da tarefa
- `PUT /api/v1.0/tasks/:task_id/description` — Atualizar descrição da tarefa

### Avaliações de Tarefa (Task Evaluations)
- `POST /api/v1.0/tasks/:task_id/evaluations` — Atualizar avaliações da tarefa
- `DELETE /api/v1.0/tasks/:task_id/evaluations` — Remover avaliações da tarefa

### Seguidores da Tarefa (Task Followers)
- `GET /api/v1.0/tasks/:task_id/followers` — Listar seguidores
- `POST /api/v1.0/tasks/:task_id/followers` — Adicionar seguidor
- `DELETE /api/v1.0/tasks/:task_id/followers/:id` — Remover seguidor

### Templates de Tarefa (Task Templates)
- `GET /api/v1.0/project_templates/:project_template_id/task_templates` — Listar task templates
- `GET /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Mostrar task template
- `POST /api/v1.0/project_templates/:project_template_id/task_templates` — Criar task template
- `PUT /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Atualizar task template
- `DELETE /api/v1.0/project_templates/:project_template_id/task_templates/:id` — Excluir task template

### Fluxos de Tarefa (Task Workflows)
- `GET /api/v1.0/workflows` — Mostrar workflow
- `POST /api/v1.0/workflows` — Criar workflow
- `DELETE /api/v1.0/workflows` — Excluir workflow

### Atribuições de Tarefa (Task Assignments)
- `DELETE /api/v1.0/tasks/:task_id/assignments/:id` — Excluir atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/play` — Iniciar atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/pause` — Pausar atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/deliver` — Entregar atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reopen` — Reabrir atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reposition` — Reposicionar atribuição
- `POST /api/v1.0/tasks/:task_id/assignments/:id/reestimate` — Reestimar atribuição

### Tipos de Tarefa (Task Types)
- `GET /api/v1.0/task_types` — Listar tipos de tarefa
- `GET /api/v1.0/task_types/:id` — Mostrar tipo de tarefa
- `POST /api/v1.0/task_types` — Criar tipo de tarefa
- `PUT /api/v1.0/task_types/:id` — Atualizar tipo de tarefa

### Tarefas (Tasks)
- `GET /api/v1.0/tasks` — Consultar tarefas
- `GET /api/v1.0/tasks/:id` — Mostrar tarefa
- `GET /api/v1.0/tasks/:id/subtasks` — Mostrar subtarefas
- `POST /api/v1.0/tasks` — Criar tarefa
- `PUT /api/v1.0/tasks/:id` — Atualizar tarefa
- `DELETE /api/v1.0/tasks/:id` — Excluir tarefa
- `POST /api/v1.0/tasks/:id/play` — Criar atribuição e iniciar trabalho
- `POST /api/v1.0/tasks/:id/pause` — Pausar tarefa/atribuição
- `POST /api/v1.0/tasks/:id/deliver` — Entregar tarefa
- `POST /api/v1.0/tasks/:id/reopen` — Reabrir tarefa
- `POST /api/v1.0/tasks/:id/move` — Mover tarefa para outro estágio

### Times (Teams)
- `GET /api/v1.0/teams` — Listar times
- `GET /api/v1.0/teams/:id` — Mostrar time
- `POST /api/v1.0/teams` — Criar time
- `PUT /api/v1.0/teams/:id` — Atualizar time
- `DELETE /api/v1.0/teams/:id` — Excluir time
- `POST /api/v1.0/teams/:id/add_member` — Adicionar membro
- `POST /api/v1.0/teams/:id/remove_member` — Remover membro

### Relatórios de Tempo Trabalhado (Time Worked)
- `GET /api/v1.0/reports/time_worked` — Listar tempo trabalhado (agrupado/filtrado)

### Usuários (Users)
- `GET /api/v1.0/users` — Listar usuários
- `GET /api/v1.0/users/:user_id` — Mostrar usuário
- `POST /api/v1.0/users` — Criar usuário
- `PUT /api/v1.0/users/:id` — Atualizar usuário

### Férias de Usuários (Users Vacations)
- `GET /api/v1.0/users_vacations` — Listar férias/ausências
- `POST /api/v1.0/users/:user_id/vacations` — Criar férias para usuário
- `GET /api/v1.0/users_vacations/:id` — Mostrar férias
- `PUT /api/v1.0/users_vacations/:id` — Atualizar férias
- `DELETE /api/v1.0/users_vacations/:id` — Excluir férias

### Elementos de Workflow (Workflow Elements)
- `GET /api/v1.0/workflows/:workflow_id/workflow_elements` — Listar elementos do workflow
- `GET /api/v1.0/workflows/:workflow_id/workflow_elements/:id` — Mostrar elemento
- `POST /api/v1.0/workflows/:workflow_id/workflow_elements` — Criar elemento
- `POST /api/v1.0/workflows/:workflow_id/workflow_elements/:id/reorder` — Reordenar elemento
- `DELETE /api/v1.0/workflows/:workflow_id/workflow_elements/:id` — Excluir elemento

### Workflows
- `GET /api/v1.0/workflows` — Listar workflows
- `POST /api/v1.0/workflows` — Criar workflow
- `DELETE /api/v1.0/workflows` — Excluir workflow

## Detalhamento de Endpoints (por grupo)

Formato padrão por método
- **Método:** verbo HTTP
- **Rota:** path
- **Descrição:** breve
- **Parâmetros (query/path):** lista (nome — descrição — tipo)
- **Body (JSON):** esquema ou exemplo
- **Cabeçalhos:** obrigatórios (ex.: `App-Key`, `User-Token`, `Content-Type`)
- **cURL:** exemplo mínimo
- **Respostas:** status esperados + exemplo JSON

### Atividades
- Método: GET
- Rota: `/api/v1.0/activities`
- Descrição: Retorna lista de atividades (visível apenas para master users).
- Parâmetros:
	- `sort` — ordenar por coluna (string)
	- `sort_dir` — direção da ordenação (`asc` ou `desc`) (string)
- Cabeçalhos: `App-Key`, `User-Token`, `Content-Type: application/json`
- cURL:
 - cURL:
```bash
curl -g "https://runrun.it/api/v1.0/activities" -X GET -H "App-Key: YOUR_APP_KEY" -H "User-Token: YOUR_USER_TOKEN"
```
- Respostas:
	- `200` — array de activity objects. Exemplo: `[{ "id":1, "trackable_type":"EnterpriseConfiguration", "actor_id":"coyote-776", "actor_name":"Coyote 776", "happened_at":"2026-03-19T18:08:14-03:00", "key":"enterprise_configuration:update", "message": null }]`

### Board Stages
- Método: GET
- Rota: `/api/v1.0/boards/:board_id/stages`
- Descrição: Lista estágios de um quadro.
- Parâmetros:
	- `board_id` (path) — id do board (integer)
	- `sort`, `sort_dir`, `search_term`, `stage_group` (query)
- Cabeçalhos: `App-Key`, `User-Token`
- cURL (list):
```bash
curl -g "https://runrun.it/api/v1.0/boards/1/stages" -H "App-Key:..." -H "User-Token:..."
```
- Respostas:
	- `200` — array de board stage objects (fields: `id`, `name`, `stage_group`, `board_id`, `position`, `use_latency_time`, `use_scrum_points`, ...)

### ...

Observação final: preenchi o documento com o template detalhado e exemplos populares para os grupos cujos dados completos já aparecem em `intergra.txt` (Activities, Board Stages, Checklist Items, Checklists, Clients, Documents, etc.). Posso agora:
- (A) Preencher exemplos JSON de resposta completos para todos endpoints (grande volume), ou
- (B) Iterar por grupos em lotes (ex.: 5 grupos por vez) e preencher detalhadamente cada rota.

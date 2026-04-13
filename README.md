# n8n-nodes-runrunit

Node n8n para integrar com a API do Runrun.it (API v1.0).

Este pacote implementa um conjunto de recursos (resources) do Runrun.it como propriedades declarativas do node para uso em workflows n8n.

Índice
- [Instalação](#instalação)
- [Credenciais](#credenciais)
- [Recursos implementados](#recursos-implementados)
- [Exemplos de uso / cURL](#exemplos-de-uso--curl)
- [Notas de implementação](#notas-de-implementação)
- [Contribuição e testes](#contribuição-e-testes)

## Instalação

Siga o guia de instalação de community nodes do n8n. Depois de instalado, importe o pacote ou coloque-o em `~/.n8n/node_modules/` conforme a documentação do n8n.

## Credenciais

O node usa credenciais `RunrunitApi` (arquivo em `credentials/RunrunitApi.credentials.ts`) que devem prover os cabeçalhos necessários:

- `App-Key`: chave da conta
- `User-Token`: token do usuário

As requests do node já possuem `requestDefaults.baseURL` apontando para `https://runrun.it/api/v1.0` e `Content-Type: application/json` quando aplicável.

## Recursos implementados

As seguintes resources foram adicionadas ao node e expostas nas propriedades (campo `resource`):

- Users (`user`)
	- Operações: `getAll` (GET /users), `get` (GET /users/:id), `create` (POST /users), `update` (PUT /users/:id)

- Teams (`team`)
	- Operações: `getAll`, `get`, `create`, `update`, `delete`, `add_member`, `remove_member`

- Tasks (`task`)
	- Operações principais: `getAll`, `get`, `create`, `update`, `delete` e ações (play/pause/move/reposition/reestimate/share/unshare/clone/etc.)

- Board Stages (`boardStage`)
	- Operações: `getAll`, `get`, `create`, `update`, `delete`, `move`, `update_use_latency_time`, `update_use_scrum_points`

- Time Worked (`timeWorked`)
	- Operação: `get` (GET /reports/time_worked)

- Comments (`comments`) — ADICIONADO
	- Operações: `getAll` (GET /tasks/:taskId/comments), `get` (GET /comments/:id), `create`, `update`, `delete`, `reaction` (POST /comments/:id/reaction)
	- Payloads via propriedade `commentObject` (JSON) enviada no body como `comment`.

- Documents (`documents`) — ADICIONADO
	- Operações: `getAll` (GET /tasks/:taskId/documents), `get`, `download`, `thumbnail`, `preview`, `create` (upload multipart), `mark_as_uploaded`, `delete`
	- Observação: `create` suporta upload via `filePath` (n8n deve fornecer o arquivo). Metadados opcionais via `documentObject` enviados como `document`.

- Checklists (`checklists`) — ADICIONADO
	- Operações: `get`, `create`, `update`, `delete` (vinculadas a `/tasks/:task_id/checklist`)

- Checklist Items (`checklistItems`) — ADICIONADO
	- Operações: `getAll`, `get`, `create`, `update`, `delete` (vinculadas a `/checklists/:checklist_id/items`)

- Clients (`clients`) — ADICIONADO
	- Operações: `getAll`, `get`, `create`, `update`, `monthly_budgets`, `update_monthly_budget`

- Descendants (`descendants`) — ADICIONADO
	- Operações: `getAll` (GET /tasks/:taskId/descendants), `create` (POST /tasks/:taskId/descendants), `delete`

- Descriptions (`descriptions`) — ADICIONADO
	- Operações: `get` (GET /descriptions?subject_type=...&subject_id=...), `update` (PUT /descriptions)

Cada resource está definido em `nodes/Runrunit/resources/<resource>/index.ts` e exportado no `Runrunit.node.ts`.

## Exemplos de uso / cURL

- Listar usuários (exemplo cURL):

```bash
curl -g "https://runrun.it/api/v1.0/users" \
	-H "App-Key: YOUR_APP_KEY" \
	-H "User-Token: YOUR_USER_TOKEN"
```

- Criar usuário via body JSON:

```bash
# Exemplo: criar um gestor (is_manager=true) e tornar parceiros mútuos
curl "https://runrun.it/api/v1.0/users" \
	-X POST \
	-H "App-Key: YOUR_APP_KEY" \
	-H "User-Token: YOUR_USER_TOKEN" \
	-H "Content-Type: application/json" \
	-d '{
		"user": {
			"name": "Novo Gestor Yesh",
			"email": "gestor.teste@yesh.com.br",
			"is_manager": true,
			"team_ids": [435586],
			"position": "Analista de Atendimento"
		},
		"make_everybody_mutual_partners": true
	}'
```

```bash
# Exemplo: criar um colaborador
curl "https://runrun.it/api/v1.0/users" \
	-X POST \
	-H "App-Key: YOUR_APP_KEY" \
	-H "User-Token: YOUR_USER_TOKEN" \
	-H "Content-Type: application/json" \
	-d '{
		"user": {
			"name": "Colaborador Teste",
			"email": "colaborador.yesh@yesh.com.br",
			"is_manager": false,
			"is_master": false,
			"team_ids": [435586],
			"position": "Suporte Nível 1"
		},
		"make_everybody_mutual_partners": true
	}'
```

- Listar comentários de uma tarefa:

```bash
curl -g "https://runrun.it/api/v1.0/tasks/123/comments" -H "App-Key: ..." -H "User-Token: ..."
```

- Upload de documento (exemplo):
```bash
curl -X POST "https://runrun.it/api/v1.0/tasks/123/documents" \
	-H "App-Key: ..." -H "User-Token: ..." \
	-F "file=@/path/to/report.pdf"
```

## Notas de implementação

- O node é declarativo (properties) e usa o sistema de `routing` do n8n para mapear operações para métodos HTTP e rotas relativas.
- Paginação: muitos endpoints suportam `page`, `limit` e cabeçalhos `Link` / `X-Item-Range`. As propriedades `getAll`/`returnAll` já foram configuradas em alguns recursos para usar paginação de offset.
- Upload de arquivos (`documents.create`): foi adicionada a propriedade `filePath` para apontar arquivo local; caso precise de comportamento avançado do n8n (binary data node input), posso implementar leitura do `binary` input e montagem multipart automaticamente.

## Contribuição e testes

- Rodar typecheck / lint:

```bash
npm install
npm run build
npm run lint
```

- Se quiser que eu rode checagem de tipos e corrija erros, posso executar agora e ajustar os arquivos modificados.

---

Se desejar, eu:
- gero exemplos JSON completos para cada endpoint descrito em `runrun.itDoc/doc.MD`, ou
- implemento suporte a upload via `binary` do n8n para `documents.create`, ou
- executo `npm run build` e corrijo problemas de tipagem.

Diga qual ação prefere em seguida.


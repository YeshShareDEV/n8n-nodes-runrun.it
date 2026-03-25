# n8n-nodes-runrunit

![version](https://img.shields.io/badge/version-2.0.12.13-blue) ![n8n](https://img.shields.io/badge/n8n-community-orange) ![Runrun.it](https://img.shields.io/badge/Runrun.it-REST%20API-blue)

Node para integração do [Runrun.it](https://runrun.it/) com o [n8n](https://n8n.io/), compatível com a API REST.

## ✨ Funcionalidades
- Autenticação automática via initSession (sem precisar criar node HTTP manual)
- Suporte a operações de CRUD para Tickets, Changes, Problems, Computers, Softwares e comentários
- Gerenciamento automático do Session-Token
- Compatível com n8n Cloud e Self-hosted
 - Credenciais seguras (Runrun.it URL, App Token, Username, Password)

--

Nota rápida: para a criação/atualização de usuários em `Administration/User` o node agora espera o payload como JSON bruto no campo `Input (raw)`.
Use a opção `Send raw body` para enviar exatamente esse JSON (sem o wrapper `{ "input": ... }`). Campos individuais como Name/Email/Password foram removidos do formulário para evitar ambiguidade.

## 🚀 Instalação

1. Clone ou baixe este repositório
2. Execute `npm install` para instalar as dependências
3. Use os scripts disponíveis para build/dev:
   - `npm run build` — build de produção
   - `npm run dev` — modo desenvolvimento

## 🔧 Configuração no n8n

1. Importe o node customizado no painel do n8n
2. Crie uma credencial do tipo **Runrun.it API** informando:
  - Runrun.it URL (ex: https://runrun.seudominio.com/api.php)
  - App Token
  - Username
  - Password
3. Use o node "Runrun.it API" nos seus fluxos, escolhendo a operação desejada (Get, Add, Update, Comment)

## 🧩 Exemplo de Uso

- Buscar um ticket:
  - Operation: Get
  - Item Type: Ticket
  - Item ID: 123
- Criar um novo computador:
  - Operation: Add
  - Item Type: Computer
  - Payload: `{ "name": "PC-01", "serial": "123456" }`

## 📁 Estrutura do Projeto

- `credentials/RunrunItApi.credentials.ts` — definição das credenciais
- `nodes/RunrunIt/RunrunItApi.node.ts` — implementação principal do node
- `nodes/RunrunIt/resources/` — módulos separados por área do Runrun.it
- `n8n-nodes-glpi-instructions.md` — instruções detalhadas e exemplos

## 📜 Licença

MIT — veja o arquivo [LICENSE.md](LICENSE.md)

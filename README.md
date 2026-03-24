# n8n-nodes-runrun.it

> Nodes n8n para integração com runrun.it

Descrição
--
Coleção de nodes para n8n que permitem integrar automações com a API do runrun.it.

Estrutura do repositório
--
- `nodes/RunrunIt/` — implementação dos nodes e transport
- `credentials/RunrunIt.credentials.ts` — definição das credenciais
- `runrun.itDoc/` — documentação adicional (doc.MD, doc.pt.MD)

Requisitos
--
- Node.js (>= 16)
- npm ou yarn
- n8n (quando for usar os nodes no ambiente n8n)

Instalação (desenvolvimento)
--
1. Instale dependências:

```bash
npm install
# ou
yarn install
```

2. Compile TypeScript (se necessário):

```bash
npm run build
# ou
npx tsc -p .
```

Como usar
--
- Os nodes estão em `nodes/RunrunIt/`. Para testar localmente, siga o fluxo de desenvolvimento do n8n para carregar nodes customizados.
- As credenciais usadas pelo node estão em `credentials/RunrunIt.credentials.ts`. Configure as credenciais no n8n conforme necessário.

Documentação
--
- Veja `runrun.itDoc/doc.pt.MD` e `runrun.itDoc/doc.MD` para detalhes da integração e exemplos de uso.

Contribuição
--
- Abra issues para bugs ou sugestões.
- Para PRs: mantenha o código em TypeScript consistente com o estilo do repositório.

Contato
--
- Mantenedor: (adicione seu contato aqui)

Licença
--
- (Adicione a licença do projeto aqui)

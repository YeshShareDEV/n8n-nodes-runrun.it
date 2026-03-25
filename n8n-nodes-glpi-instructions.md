# 🔐 Auto Init Session — Runrun.it Authentication (Obrigatório)

## 🎯 Objetivo

Eliminar a necessidade do usuário:

* Criar manualmente um node HTTP para `initSession`
* Armazenar `Session-Token` em variáveis
* Gerenciar expiração de sessão

O **Session-Token passa a ser gerado automaticamente** sempre que o node executar.

---

## 🧠 Estratégia Técnica

1. Credencial armazena:

  * Runrun.it URL
   * App-Token
   * Username
   * Password
2. O node:

   * Executa `GET /initSession`
   * Armazena o `session_token` em memória
   * Reutiliza o token em todas as chamadas subsequentes
3. Se a sessão expirar:

   * O node recria automaticamente

---

## 6️⃣ Arquivo de Credenciais (ATUALIZADO)

### 💼 `RunrunItApi.credentials.ts`

```ts
import { ICredentialType } from 'n8n-workflow';

export class RunrunItApi implements ICredentialType {
  name = 'runrunitApi';
  displayName = 'Runrun.it API';
  documentationUrl = 'https://atendimento.centrium.com.br/api.php';

  properties = [
    {
      displayName: 'Runrun.it URL',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: 'https://glpi.exemplo.com/api.php',
      required: true,
    },
    {
      displayName: 'App Token',
      name: 'appToken',
      type: 'string',
      typeOptions: { password: true },
      required: true,
      default: '',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      required: true,
      default: '',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      required: true,
      default: '',
    },
  ];
}
```

✅ **Session-Token removido da credencial**
✅ **Compatível com Basic Auth do Runrun.it**

---

---

## 7️⃣ Node Principal (ATUALIZADO)

### 📌 `RunrunItApi.node.ts` (com Auto Session)

```ts
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// 🔐 Função utilitária para inicializar sessão
async function initSession(
  this: IExecuteFunctions,
  baseUrl: string,
  appToken: string,
  username: string,
  password: string,
): Promise<string> {
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: `${baseUrl}/initSession`,
    headers: {
      'App-Token': appToken,
    },
    auth: {
      username,
      password,
    },
    json: true,
  });

  if (!response?.session_token) {
    throw new Error('Failed to init Runrun.it session');
  }

  return response.session_token;
}

export class RunrunItApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Runrun.it API',
    name: 'runrunitApi',
    icon: 'file:glpi.svg',
    group: ['transform'],
    version: 1,
    description: 'Runrun.it REST API',
    defaults: {
      name: 'Runrun.it API',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'runrunitApi', required: true }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Get Item(s)', value: 'get' },
          { name: 'Add Item', value: 'add' },
          { name: 'Update Item', value: 'update' },
          { name: 'Add Comment', value: 'comment' },
        ],
        default: 'get',
      },

      {
        displayName: 'Item Type',
        name: 'itemtype',
        type: 'options',
        options: [
          { name: 'Ticket', value: 'Ticket' },
          { name: 'Change', value: 'Change' },
          { name: 'Problem', value: 'Problem' },
          { name: 'Computer', value: 'Computer' },
          { name: 'Software', value: 'Software' },
        ],
        default: 'Ticket',
        required: true,
      },

      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'number',
        displayOptions: {
          show: { operation: ['get', 'update', 'comment'] },
        },
      },

      {
        displayName: 'Payload (JSON)',
        name: 'payload',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: { operation: ['add', 'update'] },
        },
      },

      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        displayOptions: {
          show: { operation: ['comment'] },
        },
      },

      {
        displayName: 'Private Comment',
        name: 'isPrivate',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { operation: ['comment'] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const creds = await this.getCredentials('runrunitApi');
    const baseUrl = creds.host as string;

    // 🔐 Auto init session (uma vez por execução)
    const sessionToken = await initSession.call(
      this,
      baseUrl,
      creds.appToken as string,
      creds.username as string,
      creds.password as string,
    );

    const headers = {
      'App-Token': creds.appToken as string,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    };

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter('operation', itemIndex);
        const itemtype = this.getNodeParameter('itemtype', itemIndex) as string;

        const options: any = { headers, json: true };

        if (operation === 'get') {
          const id = this.getNodeParameter('itemId', itemIndex, '') as string;
          options.method = 'GET';
          options.url = `${baseUrl}/${itemtype}${id ? '/' + id : ''}`;
        }

        if (operation === 'add') {
          options.method = 'POST';
          options.url = `${baseUrl}/${itemtype}`;
          const payload = this.getNodeParameter('payload', itemIndex);
          options.body = { input: typeof payload === 'string' ? JSON.parse(payload) : payload };
        }

        if (operation === 'update') {
          const id = this.getNodeParameter('itemId', itemIndex);
          options.method = 'PUT';
          options.url = `${baseUrl}/${itemtype}/${id}`;
          const payload = this.getNodeParameter('payload', itemIndex);
          options.body = { input: typeof payload === 'string' ? JSON.parse(payload) : payload };
        }

        if (operation === 'comment') {
          options.method = 'POST';
          options.url = `${baseUrl}/ITILFollowup`;
          options.body = {
            input: {
              items_id: this.getNodeParameter('itemId', itemIndex),
              itemtype,
              content: this.getNodeParameter('comment', itemIndex),
              is_private: this.getNodeParameter('isPrivate', itemIndex) ? 1 : 0,
            },
          };
        }

        const response = await this.helpers.httpRequest(options);
        returnData.push({
          json: response,
          pairedItem: { item: itemIndex },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: itemIndex },
          });
        } else {
          throw new NodeOperationError(this.getNode(), error, {
            itemIndex,
          });
        }
      }
    }

    return [returnData];
  }
}
```

---

## 🧠 Benefícios dessa abordagem

✅ UX perfeita (usuário só informa credencial uma vez)
✅ Sem variáveis externas
✅ Session-Token sempre válido
✅ Totalmente compatível com n8n Cloud e Self-hosted
✅ Padrão profissional de community nodes

---

## 🔜 Próximos upgrades naturais

Se quiser, o próximo passo ideal é:

1. ♻️ Cache de Session-Token (evitar initSession a cada execução)
2. 🧹 Auto `killSession`
3. 🧠 Campos dinâmicos por itemtype
4. 🛡 Validação inteligente de payload
5. 🗑 Delete item

---

## 📤 Envio de JSON bruto (opção `Send raw body`)

Ao criar ou atualizar recursos de `Administration` (ex.: `Administration/User`), o node normalmente envia o payload no formato `{ "input": { ... } }`.

Para permitir enviar exatamente o mesmo JSON que você usaria no Postman ou via cURL (sem o wrapper `{ input }`), foi adicionada a opção `Send raw body` no formulário de `create` e `update` da seção `Administration`.

Como usar:

- Cole o JSON que você quer enviar no campo `Input (raw)` do node.
- Ative `Send raw body`.
- Execute o node — o objeto que você colou será enviado diretamente como corpo da requisição (Content-Type: application/json).

Comportamento quando `Send raw body` = false (padrão):

- O node continuará a montar o corpo como `{ "input": <objeto> }` usando os campos do formulário (Name, Email, Profiles, etc.) ou o `Input (raw)` quando aplicável.

Exemplo (cURL original que você forneceu):

```
POST https://runrun.example.com/api.php/Administration/User
Content-Type: application/json

{
  "id": 132,
  "username": "teste@teste.com",
  "realname": "Teste inclusão",
  "firstname": "Teste",
  "password": "123456",
  "password2": "123456",
  "emails": [
    { "email": "teste@teste.com", "is_default": true, "is_dynamic": true }
  ],
  "is_active": true,
  "default_profile": { "id": 1 }
}
```

Cole o JSON acima em `Input (raw)` e ative `Send raw body` para replicar exatamente a requisição do cURL.

Observação: quando usar `Send raw body`, campos individuais do formulário (Name/Email/Password/Profiles/Entity) são ocultados para evitar ambiguidade.

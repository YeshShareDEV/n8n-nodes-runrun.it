# 🔐 Auto Init Session — runrun.it Authentication (Obrigatório)

## 🎯 Objetivo

Eliminar a necessidade do usuário:

* Criar manualmente um node HTTP para `initSession`
* Armazenar `Session-Token` em variáveis
* Gerenciar expiração de sessão

O **Session-Token passa a ser gerado automaticamente** sempre que o node executar.

---

## 🧠 Estratégia Técnica

1. Credencial armazena:

   * runrun.it URL
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

### 💼 `RunrunIt.credentials.ts`

```ts
import { ICredentialType } from 'n8n-workflow';

export class RunrunItApi implements ICredentialType {
  name = 'runrunItApi';
  displayName = 'runrun.it API';
  documentationUrl = 'https://docs.runrun.it/';

  properties = [
    {
      displayName: 'runrun.it URL',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: 'https://app.runrun.it',
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
✅ **Compatível com Basic Auth do runrun.it**

---

## 7️⃣ Node Principal (ATUALIZADO)

### 📌 `RunrunIt.node.ts` (com Auto Session)

(Exemplo adaptado — implementa a mesma lógica do runrun.it)

```ts
// ... mesma estrutura do node mostrado no projeto, com:
// - `name: 'runrunItApi'` nas `credentials`
// - `displayName: 'runrun.it API'`
// - `initSession` retornando erros com 'runrun.it' no texto
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

Ao criar ou atualizar recursos, o node permite enviar JSON bruto via `Input (raw)` com a opção `Send raw body` habilitada.

Exemplo (cURL original adaptado):

```
POST https://app.runrun.it/api/Administration/User
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

Cole o JSON acima em `Input (raw)` e ative `Send raw body` para replicar exatamente a requisição.

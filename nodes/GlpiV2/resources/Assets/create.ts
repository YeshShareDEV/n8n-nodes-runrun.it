import type { INodeProperties } from 'n8n-workflow';

export const AssetCreateDescription: INodeProperties[] = [
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { rows: 18 },
		default: `{
  "name": "Teste000000",
  "comment": "",
  "contact": "Teste CONTACT",
  "contact_num": null,
  "serial": "TESTE0001",
  "otherserial": null,
  "is_deleted": false,
  "status": {
    "id": 1,
    "name": "ATIVO"
  },
  "location": {
    "id": 1,
    "name": "YESHGRU"
  },
  "entity": {
    "id": 0,
    "name": "Entidade raiz",
    "completename": "Entidade raiz"
  },
  "type": {
    "id": 1,
    "name": "Notebook"
  },
  "manufacturer": {
    "id": 87,
    "name": "Acer"
  },
  "model": {
    "id": 4,
    "name": "TESTE"
  },
  "user": {
    "id": 167,
    "name": "Teste"
  },
  "user_tech": null,
  "group": [],
  "group_tech": [],
  "network": {
    "id": 1,
    "name": "Sala dos Leões GRU"
  },
  "autoupdatesystem": {
    "id": 1,
    "name": "GLPI Native Inventory"
  }
}`,
		description: 'Paste the raw JSON body as text. When Send raw body is enabled this string will be parsed and sent as the request body.',
		displayOptions: { show: { operation: ['create'], resource: ['Assets'] } },
	},

	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
		displayOptions: { show: { operation: ['create'], resource: ['Assets'] } },
	},
];

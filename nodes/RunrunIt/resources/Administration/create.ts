import type { INodeProperties } from 'n8n-workflow';

export const administrationCreateDescription: INodeProperties[] = [
	{
 		displayName: 'Item Type',
 		name: 'itemtype',
 		type: 'options',
 		description: 'Select which Administration sub-resource to create',
 		default: 'Administration/User',
 		options: [
 			{ name: 'Entity', value: 'Administration/Entity' },
 			{ name: 'Group', value: 'Administration/Group' },
 			{ name: 'Profile', value: 'Administration/Profile' },
 			{ name: 'User', value: 'Administration/User' },
 		],
 		displayOptions: { show: { resource: ['Administration'], operation: ['create'] } },
 	},

	// The node now expects a raw JSON payload for Administration/User
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { rows: 18 },
		default: `{
  "id": 132,
  "username": "teste2@teste.com",
  "realname": "Teste inclusão",
  "firstname": "Teste",
  "password": "123456",
  "password2": "123456",
  "phone": "",
  "phone2": "",
  "mobile": "",
  "emails": [
    { "email": "teste1@teste.com", "is_default": true, "is_dynamic": true }
  ],
  "comment": "string",
  "is_active": true,
  "is_deleted": false,
  "picture": null,
  "date_password_change": "2024-08-07T04:46:21+00:00",
  "authtype": 1,
  "last_login": "2026-03-06T12:16:33+00:00",
  "location": { "id": 0 },
  "default_profile": { "id": 1 },
  "default_entity": { "id": 0, "name": "Entidade raiz" }
}`,
		description: 'Raw JSON payload when creating Administration resources (e.g. Administration/User)',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'] } },
	},

	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'] } },
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const administrationUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select which Administration sub-resource to update',
		default: 'Administration/User',
		options: [
			{ name: 'Entity', value: 'Administration/Entity' },
			{ name: 'Group', value: 'Administration/Group' },
			{ name: 'Profile', value: 'Administration/Profile' },
			{ name: 'User', value: 'Administration/User' },
		],
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
	},

	// Require Item ID for update (handled in index but help text here)
	{
		displayName: 'Notice',
		name: 'notice_update_admin',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
		description: 'UPDATE requires `Item ID`. Provide only the fields you want to change.',
	},

	// Updatable fields for User
	// NOTE: The update UI for `Administration/User` now uses only `Input (raw)` and `Send raw body`.
	// Individual fields (Name, Entity, Profiles, First Name, Email) were removed
	// because payloads are expected to be provided as raw JSON.

	// Updatable fields for Group
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/Group'] } },
	},

	// Generic input fallback
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
		description: 'Raw JSON payload when more specific fields are not shown',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
	},
];

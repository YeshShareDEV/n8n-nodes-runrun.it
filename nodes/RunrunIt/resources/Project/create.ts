import type { INodeProperties } from 'n8n-workflow';

export const projectCreateDescription: INodeProperties[] = [
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Project data',
		default: {},
		displayOptions: { show: { operation: ['create'], resource: ['Project'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Additional (JSON)', name: 'additional', type: 'string', default: '' },
		],
	},
 	// Raw input option (optional)
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { alwaysOpenEditWindow: true },
		default: '',
		displayOptions: { show: { resource: ['Project'], operation: ['create'] } },
		description: 'Raw JSON payload to send when creating a Project item. When Send raw body is enabled this will be used as the request body exactly as-is.',
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Project'], operation: ['create'] } },
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
	},
];

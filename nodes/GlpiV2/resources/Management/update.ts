import type { INodeProperties } from 'n8n-workflow';

export const managementUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Add fields to update',
		default: {},
		displayOptions: { show: { operation: ['update'], resource: ['Management'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Value', name: 'value', type: 'string', default: '' },
			{ displayName: 'Additional Data (JSON)', name: 'additional', type: 'string', default: '', description: 'Free-form JSON string for extra fields' },
		],
	},
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { alwaysOpenEditWindow: true },
		default: '',
		displayOptions: { show: { resource: ['Management'], operation: ['update'] } },
		description: 'Raw JSON payload to send when updating Management data. When Send raw body is enabled this will be used as the request body exactly as-is.',
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Management'], operation: ['update'] } },
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
	},
];


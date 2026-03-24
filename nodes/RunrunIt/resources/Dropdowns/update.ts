import type { INodeProperties } from 'n8n-workflow';

export const dropdownsUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { alwaysOpenEditWindow: true },
		default: '',
		displayOptions: { show: { resource: ['Dropdowns'], operation: ['update'] } },
		description: 'Raw JSON payload to send when updating a Dropdowns item. When Send raw body is enabled this will be used as the request body exactly as-is.',
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Dropdowns'], operation: ['update'] } },
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
	},
];

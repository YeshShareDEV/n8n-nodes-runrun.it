import type { INodeProperties } from 'n8n-workflow';

export const ruleUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the rule to update',
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
	},
	{
		displayName: 'Collection',
		name: 'collection',
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Fields to update',
		default: {},
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Actions (JSON)', name: 'actions', type: 'string', default: '' },
			{ displayName: 'Criteria (JSON)', name: 'criteria', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { alwaysOpenEditWindow: true },
		default: '',
		displayOptions: { show: { resource: ['Rule'], operation: ['update'] } },
		description: 'Raw JSON payload to send when updating a Rule. When Send raw body is enabled this will be used as the request body exactly as-is.',
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Rule'], operation: ['update'] } },
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
	},
];


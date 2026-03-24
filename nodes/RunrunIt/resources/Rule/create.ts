import type { INodeProperties } from 'n8n-workflow';

export const ruleCreateDescription: INodeProperties[] = [
	{
		displayName: 'Collection',
		name: 'collection',
		type: 'string',
		default: '',
		required: true,
		description: 'Collection where the rule will be created',
		displayOptions: { show: { operation: ['create'], resource: ['Rule'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { operation: ['create'], resource: ['Rule'] } },
	},
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'collection',
		placeholder: 'Add Action',
		default: {},
		displayOptions: { show: { operation: ['create'], resource: ['Rule'] } },
		options: [
			{ displayName: 'Action Field', name: 'actionField', type: 'string', default: '' },
			{
				displayName: 'Action Type',
				name: 'actionType',
				type: 'options',
				default: 'set',
				options: [
					{ name: 'Set', value: 'set' },
					{ name: 'Clear', value: 'clear' },
					{ name: 'Notify', value: 'notify' },
				],
			},
				{
					displayName: 'Input (raw)',
					name: 'input',
					type: 'string',
					typeOptions: { alwaysOpenEditWindow: true },
					default: '',
					displayOptions: { show: { resource: ['Rule'], operation: ['create'] } },
					description: 'Raw JSON payload to send when creating a Rule. When Send raw body is enabled this will be used as the request body exactly as-is.',
				},
				{
					displayName: 'Send raw body',
					name: 'sendRawBody',
					type: 'boolean',
					default: true,
					displayOptions: { show: { resource: ['Rule'], operation: ['create'] } },
					description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
				},
		],
	},
	{
		displayName: 'Criteria',
		name: 'criteria',
		type: 'collection',
		placeholder: 'Add Criteria',
		default: {},
		displayOptions: { show: { operation: ['create'], resource: ['Rule'] } },
		options: [
			{ displayName: 'Condition', name: 'condition', type: 'options', default: 'AND', options: [ { name: 'AND', value: 'AND' }, { name: 'OR', value: 'OR' } ] },
			{ displayName: 'Criteria', name: 'criteria', type: 'string', default: '' },
		],
	},
];

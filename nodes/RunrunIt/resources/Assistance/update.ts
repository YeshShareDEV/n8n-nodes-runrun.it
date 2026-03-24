import type { INodeProperties } from 'n8n-workflow';

export const assistanceUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Assistance Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select the Assistance sub-resource to update',
		default: 'Assistance/Ticket',
		options: [
			{ name: 'Change', value: 'Assistance/Change' },
			{ name: 'Ticket', value: 'Assistance/Ticket' },
			{ name: 'Problem', value: 'Assistance/Problem' },
			{ name: 'Recurring Change', value: 'Assistance/RecurringChange' },
			{ name: 'Recurring Ticket', value: 'Assistance/RecurringTicket' },
		],
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
	},

	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Assistance item to update',
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
	},

	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
		description: 'Title or name of the assistance item',
	},

	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { alwaysOpenEditWindow: true },
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
	},

	{
		displayName: 'Status',
		name: 'status',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
		description: 'Numeric status depending on the Assistance type (ticket/change/problem).',
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
		options: [
			{
				displayName: 'ITIL Category',
				name: 'itilcategories_id',
				type: 'number',
				default: 0,
				description: 'Category ID (optional)',
			},
			{
				displayName: 'Observers (User IDs)',
				name: 'users_id_observer',
				type: 'string',
				default: '',
				description: 'Comma separated user IDs to set as observers',
			},
			],
		},
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'string',
		typeOptions: { alwaysOpenEditWindow: true },
		default: '',
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
		description: 'Raw JSON payload to send when updating an Assistance item. When Send raw body is enabled this will be used as the request body exactly as-is.',
	},
	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Assistance'], operation: ['update'] } },
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
	},
];

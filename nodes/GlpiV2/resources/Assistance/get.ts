import type { INodeProperties } from 'n8n-workflow';

export const assistanceGetDescription: INodeProperties[] = [

	{
		displayName: 'Assistance Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select the Assistance sub-resource (Change, Ticket, Problem, RecurringChange, RecurringTicket)',
		default: 'Assistance/Ticket',
		options: [
			{ name: 'Change', value: 'Assistance/Change' },
			{ name: 'Ticket', value: 'Assistance/Ticket' },
			{ name: 'Problem', value: 'Assistance/Problem' },
			{ name: 'Recurring Change', value: 'Assistance/RecurringChange' },
			{ name: 'Recurring Ticket', value: 'Assistance/RecurringTicket' },
		],
		displayOptions: { show: { resource: ['Assistance'], operation: ['get'] } },
	},

	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		default: '',
		description: 'Provide an item ID to fetch a single Assistance item. Leave empty to list items.',
		displayOptions: { show: { resource: ['Assistance'], operation: ['get'] } },
	},

	{
		displayName: 'Notice',
		name: 'notice_get_assistance',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Assistance'], operation: ['get'] } },
		description:
			'GET: provide `Item ID` to fetch a single item, or leave empty to list items. When `Include Timeline` is enabled, timeline entries will be included.',
	},

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Assistance'] } },
		options: [
			{
				displayName: 'Filter String',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Exemplo: name=ilike=*Yesh*',
			},
		],
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const assistanceDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Assistance Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select the Assistance sub-resource to delete',
		default: 'Assistance/Ticket',
		options: [
			{ name: 'Change', value: 'Assistance/Change' },
			{ name: 'Ticket', value: 'Assistance/Ticket' },
			{ name: 'Problem', value: 'Assistance/Problem' },
			{ name: 'Recurring Change', value: 'Assistance/RecurringChange' },
			{ name: 'Recurring Ticket', value: 'Assistance/RecurringTicket' },
		],
		displayOptions: { show: { resource: ['Assistance'], operation: ['delete'] } },
	},

	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Assistance item to delete',
		displayOptions: { show: { resource: ['Assistance'], operation: ['delete'] } },
	},

	{
		displayName: 'Notice',
		name: 'notice_delete_assistance',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Assistance'], operation: ['delete'] } },
		description: 'DELETE: This action will remove the item from runrun.it. Make sure the ID is correct.',
	},
];

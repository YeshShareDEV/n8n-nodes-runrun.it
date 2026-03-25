import type { INodeProperties } from 'n8n-workflow';

export const ruleDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the rule to delete',
		displayOptions: { show: { operation: ['delete'], resource: ['Rule'] } },
	},
	{
		displayName: 'Confirm Delete',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		description: 'Must be true to allow deletion',
		displayOptions: { show: { operation: ['delete'], resource: ['Rule'] } },
	},
];

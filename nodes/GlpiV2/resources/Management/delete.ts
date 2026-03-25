import type { INodeProperties } from 'n8n-workflow';

export const managementDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Confirm Delete',
		name: 'confirm',
		type: 'boolean',
		default: false,
		description: 'You must confirm deletion',
		displayOptions: { show: { operation: ['delete'], resource: ['Management'] } },
	},
];

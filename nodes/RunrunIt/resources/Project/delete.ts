import type { INodeProperties } from 'n8n-workflow';

export const projectDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		required: true,
		type: 'string',
		default: '',
		description: 'ID of the project to delete',
		displayOptions: { show: { operation: ['delete'], resource: ['Project'] } },
	},
	{
		displayName: 'Confirm Deletion',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		description: 'Must be true to allow deletion',
	},
];

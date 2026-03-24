import type { INodeProperties } from 'n8n-workflow';

export const componentsDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Notice',
		name: 'notice_delete_components',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Components'], operation: ['delete'] } },
		description: 'DELETE: provide `Item ID` of the definition or instance to delete. This action cannot be undone.',
	},
	{
		displayName: 'Confirm Delete',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['Components'], operation: ['delete'] } },
		description: 'Check to confirm deletion (prevents accidental deletes).',
	},
];

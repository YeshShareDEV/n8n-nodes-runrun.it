import type { INodeProperties } from 'n8n-workflow';

export const administrationDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select which Administration sub-resource to delete',
		default: 'Administration/User',
		options: [
			{ name: 'Entity', value: 'Administration/Entity' },
			{ name: 'Group', value: 'Administration/Group' },
			{ name: 'Profile', value: 'Administration/Profile' },
			{ name: 'User', value: 'Administration/User' },
		],
		displayOptions: { show: { resource: ['Administration'], operation: ['delete'] } },
	},
	{
		displayName: 'Confirmation',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		description: 'Confirm deletion. DELETE requires `Item ID`.',
		displayOptions: { show: { resource: ['Administration'], operation: ['delete'] } },
	},
];

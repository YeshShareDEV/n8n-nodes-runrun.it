import type { INodeProperties } from 'n8n-workflow';

export const componentsUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Notice',
		name: 'notice_update_components',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Components'], operation: ['update'] } },
		description: 'UPDATE: provide `Item ID` of the definition to update. For instances use the Instances endpoint path.',
	},
	{
		displayName: 'Title / Name',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Components'], operation: ['update'] } },
		description: 'New name/title (leave empty to keep existing)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { alwaysOpenEditWindow: true },
		displayOptions: { show: { resource: ['Components'], operation: ['update'] } },
	},
	{
		displayName: 'Additional Data',
		name: 'input',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['Components'], operation: ['update'] } },
		options: [
			{
				displayName: 'Custom Fields (JSON)',
				name: 'custom',
				type: 'string',
				default: '',
				description: 'Optional JSON string with additional properties to send',
			},
		],
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const componentsCreateDescription: INodeProperties[] = [
	{
		displayName: 'Create Instance',
		name: 'createInstance',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['Components'], operation: ['create'] } },
		description: 'If enabled, create an instance under the selected component definition; otherwise create a new component definition.',
	},
	{
		displayName: 'Definition ID (for Instance)',
		name: 'definitionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['Components'], operation: ['create'], createInstance: [true] } },
		description: 'Component definition ID to create an instance for (required when creating an instance).',
	},
	{
		displayName: 'Title / Name',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['Components'], operation: ['create'] } },
		description: 'Name or title for the definition or instance',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: { alwaysOpenEditWindow: true },
		displayOptions: { show: { resource: ['Components'], operation: ['create'] } },
		description: 'Description or notes',
	},
	{
		displayName: 'Additional Data',
		name: 'input',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['Components'], operation: ['create'] } },
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

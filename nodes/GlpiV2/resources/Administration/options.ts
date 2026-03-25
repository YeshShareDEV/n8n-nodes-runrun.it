import type { INodeProperties } from 'n8n-workflow';

export const administrationOptionsDescription: INodeProperties[] = [
	{
		displayName: 'Load Options',
		name: 'loadOptions',
		type: 'notice',
		default: '',
		description: 'Fields that load options (e.g. entities, groups, profiles) should implement `loadOptions` functions in the node to populate dynamic lists.',
		displayOptions: { show: { resource: ['Administration'] } },
	},
];

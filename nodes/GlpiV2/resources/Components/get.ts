import type { INodeProperties } from 'n8n-workflow';

export const componentsGetDescription: INodeProperties[] = [
	{
		displayName: 'Endpoint',
		name: 'componentsEndpoint',
		type: 'options',
		options: [
			{ name: 'Definitions', value: 'definitions' },
			{ name: 'Instances', value: 'instances' },
		],
		default: 'definitions',
		displayOptions: { show: { resource: ['Components'], operation: ['get'] } },
		description: 'Choose whether to list component definitions or instances',
	},
	{
		displayName: 'Definition ID (for Instances)',
		name: 'definitionId',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource: ['Components'], operation: ['get'], componentsEndpoint: ['instances'] } },
		description: 'When listing instances, optionally filter by component definition ID',
	},
	{
		displayName: 'Notice',
		name: 'notice_get_components',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Components'], operation: ['get'] } },
		description:
			'GET: provide `Item ID` to fetch a single definition or instance, or leave empty to list items. To list instances select Endpoint = Instances.',
	},
];

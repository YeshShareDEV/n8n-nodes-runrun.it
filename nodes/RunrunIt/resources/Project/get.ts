import type { INodeProperties } from 'n8n-workflow';

export const projectGetDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Project'] } },
		options: [
			{ displayName: 'Query', name: 'q', type: 'string', default: '' },
		],
	},
];

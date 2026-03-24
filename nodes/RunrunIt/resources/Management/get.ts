import type { INodeProperties } from 'n8n-workflow';

export const managementGetDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Management'] } },
		options: [
			{ displayName: 'Query', name: 'q', type: 'string', default: '' },
		],
	},
];

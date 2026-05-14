import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserGetMany = {
	operation: ['getAll'],
	resource: ['user'],
};

export const userGetManyDescription: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnlyForUserGetMany },
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Search Term',
		name: 'search_term',
		type: 'string',
		displayOptions: {
			show: showOnlyForUserGetMany,
		},
		default: '',
		description: 'Search term to filter users by name or email',
		routing: {
			send: {
				type: 'query',
				property: 'search_term',
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: showOnlyForUserGetMany },
		default: 1,
		description: 'Page number for pagination (1-based)',
		routing: {
			send: {
				type: 'query',
				property: 'page',
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		displayOptions: { show: showOnlyForUserGetMany },
		default: '',
		description: 'Field name to sort results by',
		routing: { send: { type: 'query', property: 'sort' } },
	},
	{
		displayName: 'Sort Direction',
		name: 'sort_dir',
		type: 'options',
		displayOptions: { show: showOnlyForUserGetMany, hide: { sort: [''] } },
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: 'asc',
		description: 'Direction to sort the results',
		routing: { send: { type: 'query', property: 'sort_dir' } },
	},
];

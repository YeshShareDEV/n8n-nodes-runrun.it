import type { INodeProperties } from 'n8n-workflow';
import { graphQLExecuteDescription } from './execute';
import { graphQLSchemaDescription } from './schema';
import { graphQLOptionsDescription } from './options';

const showOnlyForGraphQL = { resource: ['GraphQL'] };

export const graphQLDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForGraphQL },
		options: [
			{ name: 'Execute Query', value: 'execute', action: 'Execute GraphQL query' },
			{ name: 'Get Schema', value: 'schema', action: 'Get GraphQL schema' },
		],
		default: 'execute',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 15 },
		displayOptions: { show: { operation: ['execute'], resource: ['GraphQL'] } },
		placeholder: '{\n  query: `query { ... }`\n}',
		description: 'GraphQL query or mutation',
		default: '',
	},
	{
		displayName: 'Operation Name',
		name: 'operationName',
		type: 'string',
		displayOptions: { show: { operation: ['execute'], resource: ['GraphQL'] } },
		description: 'Optional operation name',
		default: '',
	},
	{
		displayName: 'Variables (JSON)',
		name: 'variables',
		type: 'json',
		displayOptions: { show: { operation: ['execute'], resource: ['GraphQL'] } },
		default: {},
		description: 'JSON object with variables for the query',
	},
	{
		displayName: 'Fetch Schema',
		name: 'fetchSchema',
		type: 'boolean',
		displayOptions: { show: { operation: ['schema'], resource: ['GraphQL'] } },
		default: false,
		description: 'Trigger to GET /api.php/GraphQL/Schema',
	},
	{
		displayName: 'Raw Response',
		name: 'rawResponse',
		type: 'boolean',
		displayOptions: { show: showOnlyForGraphQL },
		default: false,
		description: 'Return raw response instead of formatted JSON',
	},
	{
		displayName: 'Content-Type',
		name: 'contentType',
		type: 'options',
		options: [
			{ name: 'application/json', value: 'application/json' },
			{ name: 'application/graphql', value: 'application/graphql' },
		],
		default: 'application/json',
		displayOptions: { show: showOnlyForGraphQL },
		description: 'Content-Type header for GraphQL request',
	},
	{
		displayName: 'Custom Headers',
		name: 'customHeaders',
		type: 'fixedCollection',
		placeholder: 'Add header',
		default: {},
		typeOptions: { multipleValues: true },
		displayOptions: { show: showOnlyForGraphQL },
		options: [
			{
				name: 'headers',
				displayName: 'Headers',
				values: [
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
				],
			},
		],
	},
	...graphQLExecuteDescription,
	...graphQLSchemaDescription,
	...graphQLOptionsDescription,
];

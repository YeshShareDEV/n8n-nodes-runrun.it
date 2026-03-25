import type { INodeProperties } from 'n8n-workflow';
import { assistanceGetDescription } from './get';
import { assistanceCreateDescription } from './create';
import { assistanceUpdateDescription } from './update';
import { assistanceDeleteDescription } from './delete';
import { assistanceOptionsDescription } from './options';

const showOnlyForAssistance = {
	resource: ['Assistance'],
};

export const assistanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAssistance },
		options: [
			{ name: 'Get', value: 'get', action: 'Get an assistance item or list items' },
			{ name: 'Create', value: 'create', action: 'Create an assistance item' },
			{ name: 'Update', value: 'update', action: 'Update an assistance item' },
			{ name: 'Delete', value: 'delete', action: 'Delete an assistance item' },
		],
		default: 'get',
	},
	{
		displayName: 'Include Timeline',
		name: 'includeTimeline',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Assistance'] } },
		default: false,
		description: 'Include timeline items (Document, Followup, Solution, Task, Validation)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Assistance'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Assistance'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},

	...assistanceGetDescription,
	...assistanceCreateDescription,
	...assistanceUpdateDescription,
	...assistanceDeleteDescription,
	...assistanceOptionsDescription,
];

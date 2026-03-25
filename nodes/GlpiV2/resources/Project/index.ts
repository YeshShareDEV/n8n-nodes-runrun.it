import type { INodeProperties } from 'n8n-workflow';
import { projectGetDescription } from './get';
import { projectCreateDescription } from './create';
import { projectUpdateDescription } from './update';
import { projectDeleteDescription } from './delete';
import { projectOptionsDescription } from './options';

const showOnlyForProject = { resource: ['Project'] };

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProject },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a project or task' },
			{ name: 'Create', value: 'create', action: 'Create a project or task' },
			{ name: 'Update', value: 'update', action: 'Update a project or task' },
			{ name: 'Delete', value: 'delete', action: 'Delete a project or task' },
		],
		default: 'get',
	},
	{
		displayName: 'Sub-resource',
		name: 'subresource',
		type: 'options',
		displayOptions: { show: showOnlyForProject },
		options: [{ name: 'Task', value: 'Task' }],
		default: 'Task',
		description: 'Sub-resource of Project',
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'number',
		placeholder: 'Deixe vazio para listar todos',
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get', 'update', 'delete'], resource: ['Project'] } },
		description: 'ID do item quando aplicável',
		default: 0,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Project'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Project'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},
		
	...projectGetDescription,
	...projectCreateDescription,
	...projectUpdateDescription,
	...projectDeleteDescription,
	...projectOptionsDescription,
];

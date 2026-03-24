import type { INodeProperties } from 'n8n-workflow';
import { managementGetDescription } from './get';
import { managementCreateDescription } from './create';
import { managementUpdateDescription } from './update';
import { managementDeleteDescription } from './delete';
import { managementOptionsDescription } from './options';

const showOnlyForManagement = { resource: ['Management'] };

export const managementDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForManagement },
		options: [
			{ name: 'Get', value: 'get', action: 'Get an item' },
			{ name: 'Create', value: 'create', action: 'Create an item' },
			{ name: 'Update', value: 'update', action: 'Update an item' },
			{ name: 'Delete', value: 'delete', action: 'Delete an item' },
		],
		default: 'get',
	},
	{
		displayName: 'Sub-resource',
		name: 'subresource',
		type: 'options',
		displayOptions: { show: showOnlyForManagement },
		options: [
			{ name: 'Budget', value: 'Budget' },
			{ name: 'Cluster', value: 'Cluster' },
			{ name: 'Contact', value: 'Contact' },
			{ name: 'Contract', value: 'Contract' },
			{ name: 'DataCenter', value: 'DataCenter' },
			{ name: 'Database', value: 'Database' },
			{ name: 'Document', value: 'Document' },
			{ name: 'Domain', value: 'Domain' },
			{ name: 'License', value: 'License' },
			{ name: 'Line', value: 'Line' },
			{ name: 'Supplier', value: 'Supplier' },
		],
		default: 'Contact',
		required: true,
		description: 'Select the Management sub-resource to operate on',
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'number',
		placeholder: 'Deixe vazio para listar todos',
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get', 'update', 'delete'], resource: ['Management'] } },
		description: 'ID do item quando aplicável',
		default: 0,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Management'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Management'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},

	...managementGetDescription,
	...managementCreateDescription,
	...managementUpdateDescription,
	...managementDeleteDescription,
	...managementOptionsDescription,
];

import type { INodeProperties } from 'n8n-workflow';
import { TaskGetDescription } from './get';
import { TaskCreateDescription } from './create';
import { TaskUpdateDescription } from './update';
import { TaskDeleteDescription } from './delete';
import { taskOptionsDescription } from './options';

const showOnlyForTasks = {
	resource: ['Tasks'],
};

export const TasksDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTasks,
		},
		options: [
			{ name: 'Get', value: 'get', action: 'Get a task' },
			{ name: 'Create', value: 'create', action: 'Create a task' },
			{ name: 'Update', value: 'update', action: 'Update a task' },
			{ name: 'Delete', value: 'delete', action: 'Delete a task' },
		],
		default: 'get',
	},
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		displayOptions: {
			show: showOnlyForTasks,
		},
		options: [
			{ name: 'Appliance', value: 'Appliance' },
			{ name: 'Cable', value: 'Cable' },
			{ name: 'Cartridge', value: 'CartridgeItem' },
			{ name: 'Certificate', value: 'Certificate' },
			{ name: 'Computer', value: 'Computer' },
			{ name: 'Consumable', value: 'ConsumableItem' },
			{ name: 'Custom', value: 'Custom' },
			{ name: 'Enclosure', value: 'Enclosure' },
			{ name: 'Monitor', value: 'Monitor' },
			{ name: 'Network Equipment', value: 'NetworkEquipment' },
			{ name: 'PDU', value: 'PDU' },
			{ name: 'Passive Device', value: 'PassiveDCEquipment' },
			{ name: 'Peripheral', value: 'Peripheral' },
			{ name: 'Phone', value: 'Phone' },
			{ name: 'Printer', value: 'Printer' },
			{ name: 'Rack', value: 'Rack' },
			{ name: 'Socket', value: 'Socket' },
			{ name: 'Software', value: 'Software' },
			{ name: 'Software License', value: 'SoftwareLicense' },
			{ name: 'Unmanaged', value: 'Unmanaged' },
		],
		default: 'Computer',
		required: true,
		description: 'Type of task',
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'number',
		placeholder: 'Deixe vazio para listar todos',
		typeOptions: { minValue: 1 },
		displayOptions: {
				show: {
					operation: ['get', 'update', 'delete'],
					resource: ['Tasks'],
				},
		},
		default: 0,
		description: 'ID do item. Deixe vazio para listar todos (aplicável ao GET).',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
				show: {
					operation: ['get'],
					resource: ['Tasks'],
				},
		},
		default: false,
		description: 'Retornar todos os itens sem paginação',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
				show: {
					operation: ['get'],
					returnAll: [false],
					resource: ['Tasks'],
				},
		},
		description: 'Limite de itens retornados quando Return All for false',
	},
    
	...TaskGetDescription,
	...TaskCreateDescription,
	...TaskUpdateDescription,
	...TaskDeleteDescription,
	...taskOptionsDescription,
];

import type { INodeProperties } from 'n8n-workflow';
import { componentsGetDescription } from './get';
import { componentsCreateDescription } from './create';
import { componentsUpdateDescription } from './update';
import { componentsDeleteDescription } from './delete';
import { componentsOptionsDescription } from './options';

const showOnlyForComponents = {
	resource: ['Components'],
};

export const componentsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForComponents },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a component' },
			{ name: 'Create', value: 'create', action: 'Create a component' },
			{ name: 'Update', value: 'update', action: 'Update a component' },
			{ name: 'Delete', value: 'delete', action: 'Delete a component' },
		],
		default: 'get',
		required: true,
		description: 'Operation to perform on Components',
	},
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		displayOptions: { show: showOnlyForComponents },
		options: [
			{ name: 'Battery', value: 'Battery' },
			{ name: 'Camera', value: 'Camera' },
			{ name: 'Case', value: 'Case' },
			{ name: 'Controller', value: 'Controller' },
			{ name: 'Drive', value: 'Drive' },
			{ name: 'Firmware', value: 'Firmware' },
			{ name: 'Generic Device', value: 'GenericDevice' },
			{ name: 'Graphic Card', value: 'GraphicCard' },
			{ name: 'Hard Drive', value: 'HardDrive' },
			{ name: 'Memory', value: 'Memory' },
			{ name: 'Network Card', value: 'NetworkCard' },
			{ name: 'PCI Device', value: 'PCIDevice' },
			{ name: 'Power Supply', value: 'PowerSupply' },
			{ name: 'Processor', value: 'Processor' },
			{ name: 'SIM Card', value: 'SIMCard' },
			{ name: 'Sensor', value: 'Sensor' },
			{ name: 'Sound Card', value: 'SoundCard' },
			{ name: 'Systemboard', value: 'Systemboard' },
		],
		default: 'Memory',
		required: true,
		description: 'Type of component',
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'number',
		placeholder: 'ID da definição ou instância',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get', 'update', 'delete'], resource: ['Components'] } },
		description: 'ID da definição ou instância (quando aplicável)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Components'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Components'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},
	// Start removed per UI requirements
	...componentsGetDescription,
	...componentsCreateDescription,
	...componentsUpdateDescription,
	...componentsDeleteDescription,
	...componentsOptionsDescription,
];

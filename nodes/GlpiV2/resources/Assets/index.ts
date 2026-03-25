import type { INodeProperties } from 'n8n-workflow';
import { AssetGetDescription } from './get';
import { AssetCreateDescription } from './create';
import { AssetUpdateDescription } from './update';
import { AssetDeleteDescription } from './delete';
import { assetOptionsDescription } from './options';

const showOnlyForAssets = {
	resource: ['Assets'],
};

export const AssetsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAssets,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an asset',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an asset',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an asset',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an asset',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		displayOptions: {
			show: showOnlyForAssets,
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
		description: 'Type of asset',
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
				resource: ['Assets'],
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
				resource: ['Assets'],
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
				resource: ['Assets'],
			},
		},
		description: 'Limite de itens retornados quando Return All for false',
	},
    
	...AssetGetDescription,
	...AssetCreateDescription,
	...AssetUpdateDescription,
	...AssetDeleteDescription,
	...assetOptionsDescription,
];

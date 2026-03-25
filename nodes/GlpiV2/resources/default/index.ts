import type { INodeProperties } from 'n8n-workflow';
import { defaultDynamicDescription } from './dynamic';
import { defaultOptionsDescription } from './options';

const showOnlyForDefault = { resource: ['Default'] };

export const defaultDescription: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDefault },
		options: [
			{ name: 'Dynamic', value: 'dynamic', action: 'Perform a dynamic API request' },
			{ name: 'Transfer', value: 'transfer', action: 'Transfer payload' },
		],
		placeholder: 'e.g. Transfer or Setup/Options',
		default: 'dynamic',
		description: 'Path to append to /api.php (validate/sanitize before use)',
	},
	{
		displayName: 'Headers',
		name: 'headers',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add header',
		default: { header: [] },
		displayOptions: { show: { operation: ['dynamic'], resource: ['Default'] } },
		options: [
			{
				name: 'header',
				displayName: 'Header',
				values: [
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: 'Body (JSON)',
		name: 'body',
		type: 'json',
		default: {},
		displayOptions: { show: { operation: ['dynamic'], resource: ['Default'], method: ['POST', 'PUT', 'PATCH'] } },
		description: 'JSON body for mutating requests',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['dynamic'], resource: ['Default'], method: ['GET', 'OPTIONS'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['dynamic'], returnAll: [false], resource: ['Default'] } },
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { operation: ['dynamic'], returnAll: [false], resource: ['Default'] } },
		description: 'Offset to start returning items from (for pagination)',
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['dynamic'], resource: ['Default'] } },
		description: 'Field name to sort by (server-side if supported)',
	},
	// Start removed per UI requirements
	// Transfer action convenience
	{
		displayName: 'Transfer Payload',
		name: 'transferPayload',
		type: 'collection',
		placeholder: 'Fields for Transfer',
		default: {},
		displayOptions: { show: { operation: ['transfer'], resource: ['Default'] } },
		options: [
			{ displayName: 'Data', name: 'data', type: 'string', default: '' },
		],
	},
	// Safety checkbox for mutating actions
	{
		displayName: 'Require Confirmation',
		name: 'requireConfirmation',
		type: 'boolean',
		default: true,
		displayOptions: { show: { operation: ['dynamic'], resource: ['Default'], method: ['POST', 'PUT', 'PATCH', 'DELETE'] } },
		description: 'When true, require user confirmation before executing mutating requests',
	},
	...defaultDynamicDescription,
	...defaultOptionsDescription,
];

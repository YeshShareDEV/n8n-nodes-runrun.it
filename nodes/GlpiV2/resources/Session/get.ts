import type { INodeProperties } from 'n8n-workflow';

export const sessionGetDescription: INodeProperties[] = [
	{
		displayName: 'Return Raw JSON',
		name: 'raw',
		type: 'boolean',
		default: true,
		description: 'When enabled return the raw JSON response; otherwise show simplified key/value',
		displayOptions: { show: { operation: ['get'], resource: ['Session'] } },
	},
	{
		displayName: 'Show Re-auth Link',
		name: 'reauthLink',
		type: 'boolean',
		default: true,
		description: 'When 401/403 occurs, include an authorization URL suggestion in the error message',
		displayOptions: { show: { operation: ['get'], resource: ['Session'] } },
	},
];

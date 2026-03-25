import type { INodeProperties } from 'n8n-workflow';

export const componentsOptionsDescription: INodeProperties[] = [
	{
		displayName: 'Items Sub-endpoint',
		name: 'components_items_note',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Components'] } },
		description:
			'To work with component instances use the sub-endpoint: /Components/{ComponentType}/Items/{id}. Use Endpoint = Instances in the Get operation to list instances.',
	},
];

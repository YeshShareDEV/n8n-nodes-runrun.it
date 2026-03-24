import type { INodeProperties } from 'n8n-workflow';

export const assistanceOptionsDescription: INodeProperties[] = [
	{
		displayName: 'Timeline Types',
		name: 'timelineTypes',
		type: 'multiOptions',
		displayOptions: { show: { resource: ['Assistance'], operation: ['get'], includeTimeline: [true] } },
		options: [
			{ name: 'Document', value: 'Document' },
			{ name: 'Followup', value: 'Followup' },
			{ name: 'Solution', value: 'Solution' },
			{ name: 'Task', value: 'Task' },
			{ name: 'Validation', value: 'Validation' },
		],
		default: [],
		description: 'Select timeline item types to include when `Include Timeline` is enabled.',
	},
];

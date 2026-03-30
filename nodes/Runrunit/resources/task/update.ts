import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskUpdate = {
	operation: ['update'],
	resource: ['task'],
};

export const taskUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: { show: showOnlyForTaskUpdate },
		default: '',
		required: true,
		description: 'ID of the task to update',
	},
	{
		displayName: 'Task Object (JSON)',
		name: 'taskObject',
		type: 'json',
		displayOptions: { show: showOnlyForTaskUpdate },
		default: '{"custom_fields": {}}',
		description: 'Full task object or partial object that will be sent as the `task` payload (e.g. {"custom_fields": {"custom_20":"Sim"}}).',
		routing: {
			send: {
				type: 'body',
				property: 'task',
			},
		},
	},
];

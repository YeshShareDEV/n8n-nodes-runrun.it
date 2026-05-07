import type { INodeProperties } from 'n8n-workflow';

export const taskCreateDescription: INodeProperties[] = [
	{
		displayName: 'Task Object (JSON)',
		name: 'taskObject',
		type: 'json',
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		default: '{"title":""}',
		description: 'Task object to create, sent as `task` in the body',
		routing: {
			send: {
				type: 'body',
				property: 'task',
			},
		},
	},
];

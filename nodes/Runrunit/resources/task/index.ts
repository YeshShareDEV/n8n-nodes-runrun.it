import type { INodeProperties } from 'n8n-workflow';
import { taskUpdateDescription } from './update';

const showOnlyForTasks = {
	resource: ['task'],
};

const taskGetManyDescription: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForTasks,
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForTasks,
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'offset',
					properties: {
						limitParameter: 'limit',
						offsetParameter: 'offset',
						pageSize: 100,
						type: 'query',
					},
				},
			},
		},
	},
];

const taskGetDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the task',
	},
];

const taskCreateDescription: INodeProperties[] = [
	{
		displayName: 'Task Object (JSON)',
		name: 'taskObject',
		type: 'json',
		default: '{"title":""}',
		description: 'Task object to create. Will be sent as `task` in the body.',
		routing: {
			send: {
				type: 'body',
				property: 'task',
			},
		},
	},
];

const taskDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the task to delete',
	},
];

const taskActionBody: INodeProperties[] = [
	{
		displayName: 'Payload (JSON)',
		name: 'payload',
		type: 'json',
		default: '{}',
		description: 'Optional payload to send with the action',
		routing: {
			send: {
				type: 'body',
				property: 'data',
			},
		},
	},
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update_comment'],
				resource: ['task'],
			},
		},
		default: '',
		description: 'ID of the comment to update (for Update Comment operation)',
	},
];

export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTasks },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tasks',
				description: 'Get many tasks',
				routing: { request: { method: 'GET', url: '/tasks' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description: 'Get a single task',
				routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}' } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a task',
				description: 'Create a new task',
				routing: { request: { method: 'POST', url: '/tasks' } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a task',
				description: 'Update task fields',
				routing: { request: { method: 'PUT', url: '=/tasks/{{$parameter.taskId}}' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a task',
				description: 'Delete a task',
				routing: { request: { method: 'DELETE', url: '=/tasks/{{$parameter.taskId}}' } },
			},
			{
				name: 'Deliver',
				value: 'deliver',
				action: 'Deliver a task',
				description: 'Move task to delivered/closed state',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/deliver' } },
			},
			{
				name: 'Reopen',
				value: 'reopen',
				action: 'Reopen a task',
				description: 'Reopen a closed task',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/reopen' } },
			},
			{
				name: 'Move',
				value: 'move',
				action: 'Move a task between stages',
				description: 'Move task between stages',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/move' } },
			},
			{
				name: 'Add Manual Work Period',
				value: 'add_manual_work_period',
				action: 'Add manual work period to task',
				description: 'Add manual work period',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/add_manual_work_period' } },
			},
			{
				name: 'Change Time Worked',
				value: 'change_time_worked',
				action: 'Change total time worked on task',
				description: 'Change time worked',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/change_time_worked' } },
			},
			{
				name: 'Add Comment',
				value: 'add_comment',
				action: 'Add a comment to a task',
				description: 'Create a comment on a task',
				routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/comments' } },
			},
			{
				name: 'Update Comment',
				value: 'update_comment',
				action: 'Update a comment on a task',
				description: 'Update a task comment',
				routing: { request: { method: 'PUT', url: '=/tasks/{{$parameter.taskId}}/comments/{{$parameter.commentId}}' } },
			},
		],
		default: 'getAll',
	},
	...taskGetManyDescription,
	...taskGetDescription,
	...taskCreateDescription,
	...taskUpdateDescription,
	...taskDeleteDescription,
	...taskActionBody,
];

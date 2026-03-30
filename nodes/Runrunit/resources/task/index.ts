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

const showOnlyForTaskWithId = {
	resource: ['task'],
	operation: [
		'get',
		'get_subtasks',
		'play',
		'pause',
		'change_board',
		'change_project',
		'change_type',
		'reposition',
		'reestimate',
		'share',
		'unshare',
		'complete_workflow_step',
		'undo_workflow_step',
		'mark_as_urgent',
		'unmark_as_urgent',
		'create_assignments',
		'move_to_top',
		'move_to_next_stage',
		'get_form_answers',
		'get_fields',
		'deliver',
		'reopen',
		'move',
		'add_manual_work_period',
		'change_time_worked',
		'add_comment',
		'update_comment',
		'update',
		'delete',
	],
};

const taskGetDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: { show: showOnlyForTaskWithId },
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
		displayOptions: { show: showOnlyForTaskWithId },
		default: '',
		required: true,
		description: 'ID of the task to delete',
	},
];

const showOnlyForActionOps = {
	resource: ['task'],
	operation: [
		'play',
		'pause',
		'change_board',
		'change_project',
		'change_type',
		'reposition',
		'reestimate',
		'share',
		'unshare',
		'complete_workflow_step',
		'undo_workflow_step',
		'create_assignments',
		'move',
		'add_manual_work_period',
		'change_time_worked',
		'add_comment',
		'update_comment',
		'clone',
	],
};

const taskActionBody: INodeProperties[] = [
	{
		displayName: 'Payload (JSON)',
		name: 'payload',
		type: 'json',
		displayOptions: { show: showOnlyForActionOps },
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
				{
					name: 'Get Subtasks',
					value: 'get_subtasks',
					action: 'Get subtasks of a task',
					description: 'List subtasks for a task',
					routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/subtasks' } },
				},
				{
					name: 'Play',
					value: 'play',
					action: 'Play a task',
					description: 'Create assignment and play a task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/play' } },
				},
				{
					name: 'Pause',
					value: 'pause',
					action: 'Pause a task',
					description: 'Pause a task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/pause' } },
				},
				{
					name: 'Change Board',
					value: 'change_board',
					action: 'Change task board',
					description: 'Change the board of a task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/change_board' } },
				},
				{
					name: 'Change Project',
					value: 'change_project',
					action: 'Change task project',
					description: 'Change the project of a task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/change_project' } },
				},
				{
					name: 'Change Type',
					value: 'change_type',
					action: 'Change task type',
					description: 'Change the type of a task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/change_type' } },
				},
				{
					name: 'Reposition',
					value: 'reposition',
					action: 'Reposition a task',
					description: 'Reposition a task within a stage',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/reposition' } },
				},
				{
					name: 'Reestimate',
					value: 'reestimate',
					action: 'Reestimate a task',
					description: 'Change task estimation/points',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/reestimate' } },
				},
				{
					name: 'Share',
					value: 'share',
					action: 'Share a task',
					description: 'Share the task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/share' } },
				},
				{
					name: 'Unshare',
					value: 'unshare',
					action: 'Unshare a task',
					description: 'Unshare the task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/unshare' } },
				},
				{
					name: 'Complete Workflow Step',
					value: 'complete_workflow_step',
					action: 'Complete a workflow step',
					description: 'Complete a workflow step for the task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/complete_workflow_step' } },
				},
				{
					name: 'Undo Workflow Step',
					value: 'undo_workflow_step',
					action: 'Undo a workflow step',
					description: 'Undo a workflow step for the task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/undo_workflow_step' } },
				},
				{
					name: 'Mark As Urgent',
					value: 'mark_as_urgent',
					action: 'Mark task as urgent',
					description: 'Mark the task as urgent',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/mark_as_urgent' } },
				},
				{
					name: 'Unmark As Urgent',
					value: 'unmark_as_urgent',
					action: 'Unmark task as urgent',
					description: 'Remove urgent mark from task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/unmark_as_urgent' } },
				},
				{
					name: 'Create Assignments',
					value: 'create_assignments',
					action: 'Create assignment for another user',
					description: 'Create assignments for the task',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/create_assignments' } },
				},
				{
					name: 'Move To Top',
					value: 'move_to_top',
					action: 'Move task to top',
					description: 'Move the task to the top of the list',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/move_to_top' } },
				},
				{
					name: 'Clone',
					value: 'clone',
					action: 'Clone a task',
					description: 'Clone an existing task',
					routing: { request: { method: 'POST', url: '/tasks/clone' } },
				},
				{
					name: 'Move To Next Stage',
					value: 'move_to_next_stage',
					action: 'Move task to next stage',
					description: 'Advance the task to the next stage',
					routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/move_to_next_stage' } },
				},
				{
					name: 'Get Form Answers',
					value: 'get_form_answers',
					action: 'Get form answers for a task',
					description: 'Retrieve form answers that created the task',
					routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/form_answers' } },
				},
				{
					name: 'Get Fields',
					value: 'get_fields',
					action: 'Get fields of a task board',
					description: "List fields from task's board",
					routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/fields' } },
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

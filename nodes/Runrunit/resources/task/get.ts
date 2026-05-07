import type { INodeProperties } from 'n8n-workflow';

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
		'delete',
	],
};

export const taskGetDescription: INodeProperties[] = [
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

import type { INodeProperties } from 'n8n-workflow';

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

export const taskActionBody: INodeProperties[] = [
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
		displayOptions: { show: { resource: ['task'], operation: ['update_comment'] } },
		default: '',
		description: 'ID of the comment to update (for Update Comment operation)',
	},
];

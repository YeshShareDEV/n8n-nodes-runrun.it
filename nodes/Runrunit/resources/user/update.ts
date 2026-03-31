import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserUpdate = {
	operation: ['update'],
	resource: ['user'],
};

export const userUpdateDescription: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: { show: showOnlyForUserUpdate },
		default: '',
		required: true,
		description: "ID of the user to update",
	},
	{
		displayName: 'User Object (JSON)',
		name: 'userObject',
		type: 'json',
		displayOptions: { show: showOnlyForUserUpdate },
		default: '{"name":"","email":"","role":"user"}',
		description: 'Full user object or partial object that will be sent as the `user` payload (e.g. {"name":"Maria"})',
		routing: {
			send: {
				type: 'body',
				property: 'user',
			},
		},
	},
];

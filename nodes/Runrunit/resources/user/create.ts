import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserCreate = {
	operation: ['create'],
	resource: ['user'],
};

export const userCreateDescription: INodeProperties[] = [
	{
		displayName: 'User Object (JSON)',
		name: 'userObject',
		type: 'json',
		displayOptions: { show: showOnlyForUserCreate },
		default: '{"name":"","email":"","role":"user"}',
		description: 'Full user object that will be sent as the `user` payload (e.g. {"name":"Joao","email":"joao@example.com","role":"user"}).',
		routing: {
			send: {
				type: 'body',
				property: 'user',
			},
		},
	},
];

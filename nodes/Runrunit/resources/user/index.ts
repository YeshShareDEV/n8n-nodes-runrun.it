import type { INodeProperties } from 'n8n-workflow';
import { userCreateDescription } from './create';
import { userGetDescription } from './get';
import { userGetManyDescription } from './getAll';
import { userUpdateDescription } from './update';

const showOnlyForUsers = {
	resource: ['user'],
};

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get users',
				description: 'Get many users',
				routing: {
					request: {
						method: 'GET',
						url: '/users',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
				routing: {
					request: {
						method: 'GET',
						url: '=/users/{{$parameter.userId}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new user',
				description: 'Create a new user',
				routing: {
					request: {
						method: 'POST',
						url: '/users',
					},
				},
			},
            {
                name: 'Update',
                value: 'update',
                action: 'Update a user',
                description: 'Update an existing user',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/users/{{$parameter.userId}}',
                    },
                },
            },
		],
		default: 'getAll',
	},
	...userGetManyDescription,
	...userGetDescription,
	...userCreateDescription,
	...userUpdateDescription,
];

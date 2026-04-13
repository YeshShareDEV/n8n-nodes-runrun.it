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
		default: '{"name":"Colaborador Teste","email":"colaborador.yesh@yesh.com.br","is_manager":false,"team_ids":[435586],"position":"Suporte Nível 1"}',
		description: 'Full user object or partial object that will be sent as the `user` payload (e.g. {"name":"Maria"})',
		routing: {
			send: {
				type: 'body',
				property: 'user',
			},
		},
	},
	{
		displayName: 'Make Everybody Mutual Partners',
		name: 'makeEverybodyMutualPartners',
		type: 'boolean',
		displayOptions: { show: showOnlyForUserUpdate },
		default: false,
		description: 'Whether to make everybody mutual partners (sends as make_everybody_mutual_partners)',
		routing: {
			send: {
				type: 'body',
				property: 'make_everybody_mutual_partners',
			},
		},
	},
];

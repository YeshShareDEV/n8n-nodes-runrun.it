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
		default: '{"name":"Colaborador Teste","email":"colaborador.yesh@yesh.com.br","is_manager":false,"is_master":false,"team_ids":[435586],"position":"Suporte Nível 1"}',
		description: 'Full user object that will be sent as the `user` payload. Fields: name, email, is_manager, is_master, team_ids, position',
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
		displayOptions: { show: showOnlyForUserCreate },
		default: true,
		description: 'Whether to make everybody mutual partners (sends as make_everybody_mutual_partners)',
		routing: {
			send: {
				type: 'body',
				property: 'make_everybody_mutual_partners',
			},
		},
	},
];

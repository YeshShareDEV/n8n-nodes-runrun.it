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
		default: '{"name":"Novo Gestor Yesh","email":"gestor.teste@yesh.com.br","is_manager":true,"team_ids":[435586],"position":"Analista de Atendimento"}',
		description: 'Full user object that will be sent as the `user` payload. Example: {"name":"Joao","email":"joao@example.com","is_manager":false,"team_ids":[123],"position":"Analista"}',
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

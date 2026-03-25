import type { INodeProperties } from 'n8n-workflow';

export const TaskGetDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Tasks'] } },
		options: [
            { 
                displayName: 'Filter String', 
                name: 'filter', // ALTERADO: Agora bate com o ?filter= da URL
                type: 'string', 
                default: '',
                description: 'Exemplo: name=ilike=*Yesh*',
            },
        ],
	},
];

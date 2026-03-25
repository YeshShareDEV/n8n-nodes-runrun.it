import type { INodeProperties } from 'n8n-workflow';

export const ruleGetDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'itemid',
		type: 'string',
		default: '',
		description: 'ID of the rule to retrieve (leave empty to list)',
		displayOptions: { show: { operation: ['get'], resource: ['Rule'] } },
	},
// `Collection`, `Return All` and `Limit` are defined in the aggregator (index.ts).
// Keep only the rule-specific identifier here.
];

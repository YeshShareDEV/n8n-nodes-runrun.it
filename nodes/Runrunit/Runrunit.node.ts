import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { taskDescription } from './resources/task';
import { teamDescription } from './resources/team';
import { timeWorkedDescription } from './resources/timeWorked';
import { boardStageDescription } from './resources/boardStage';
import { commentsDescription } from './resources/comments';
import { documentsDescription } from './resources/documents';
import { checklistsDescription } from './resources/checklists';
import { checklistItemsDescription } from './resources/checklistItems';
import { clientsDescription } from './resources/clients';
import { descendantsDescription } from './resources/descendants';
import { descriptionsDescription } from './resources/descriptions';

export class Runrunit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Runrunit',
		name: 'runrunit',
		icon: { light: 'file:runrunit.svg', dark: 'file:runrunit.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Runrunit API',
		defaults: {
			name: 'Runrunit',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'runrunitApi', required: true }],
		requestDefaults: {
			baseURL: 'https://runrun.it/api/v1.0',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'Board Stages',
						value: 'boardStage',
					},
					{
						name: 'Comments',
						value: 'comments',
					},
					{
						name: 'Documents',
						value: 'documents',
					},
					{
						name: 'Checklists',
						value: 'checklists',
					},
					{
						name: 'Checklist Items',
						value: 'checklistItems',
					},
					{
						name: 'Clients',
						value: 'clients',
					},
					{
						name: 'Descendants',
						value: 'descendants',
					},
					{
						name: 'Descriptions',
						value: 'descriptions',
					},
					{
						name: 'Time Worked',
						value: 'timeWorked',
					},
				],
				default: 'user',
				},
						...teamDescription,
						...timeWorkedDescription,
						...boardStageDescription,
						...clientsDescription,
						...commentsDescription,
						...documentsDescription,
						...checklistsDescription,
						...checklistItemsDescription,
						...descendantsDescription,
						...descriptionsDescription,
						...userDescription,
						...taskDescription,
		],
	};
}

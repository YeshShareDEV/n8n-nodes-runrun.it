import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	NodeOperationError,
	type INodeExecutionData,
	type IExecuteFunctions,
} from 'n8n-workflow';
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
import { projectsDescription } from './resources/projects';
import { descendantsDescription } from './resources/descendants';
import { descriptionsDescription } from './resources/descriptions';
import * as TaskExecute from './resources/executers/TaskExecute';
import * as UserExecute from './resources/executers/UserExecute';
import * as ClientsExecute from './resources/executers/ClientsExecute';
import * as TeamExecute from './resources/executers/TeamExecute';
import * as BoardStageExecute from './resources/executers/BoardStageExecute';
import * as CommentsExecute from './resources/executers/CommentsExecute';
import * as DocumentsExecute from './resources/executers/DocumentsExecute';
import * as ChecklistsExecute from './resources/executers/ChecklistsExecute';
import * as ChecklistItemsExecute from './resources/executers/ChecklistItemsExecute';
import * as DescendantsExecute from './resources/executers/DescendantsExecute';
import * as DescriptionsExecute from './resources/executers/DescriptionsExecute';
import * as TimeWorkedExecute from './resources/executers/TimeWorkedExecute';
import * as ProjectsExecute from './resources/executers/ProjectsExecute';

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
					{ name: 'User', value: 'user' },
					{ name: 'Task', value: 'task' },
					{ name: 'Team', value: 'team' },
					{ name: 'Projects', value: 'projects' },
					{ name: 'Board Stages', value: 'boardStage' },
					{ name: 'Comments', value: 'comments' },
					{ name: 'Documents', value: 'documents' },
					{ name: 'Checklists', value: 'checklists' },
					{ name: 'Checklist Items', value: 'checklistItems' },
					{ name: 'Clients', value: 'clients' },
					{ name: 'Descendants', value: 'descendants' },
					{ name: 'Descriptions', value: 'descriptions' },
					{ name: 'Time Worked', value: 'timeWorked' },
				],
				default: 'user',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Execute request', value: 'execute' },
					{ name: 'Preview curl', value: 'preview' },
				],
				default: 'execute',
				description: 'Choose to execute the API request or only preview the curl command.',
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
			...projectsDescription,
			...userDescription,
			...taskDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const executors: Record<string, (instance: IExecuteFunctions, operation: string) => Promise<INodeExecutionData[][]>> = {
			task: TaskExecute.execute,
			user: UserExecute.execute,
			clients: ClientsExecute.execute,
			team: TeamExecute.execute,
			boardStage: BoardStageExecute.execute,
			comments: CommentsExecute.execute,
			documents: DocumentsExecute.execute,
			projects: ProjectsExecute.execute,
			checklists: ChecklistsExecute.execute,
			checklistItems: ChecklistItemsExecute.execute,
			descendants: DescendantsExecute.execute,
			descriptions: DescriptionsExecute.execute,
			timeWorked: TimeWorkedExecute.execute,
		};

		const executor = executors[resource];
		if (!executor) throw new NodeOperationError(this.getNode(), `Resource not implemented: ${resource}`);

		return await executor(this, operation);
	}
}
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription, NodeOperationError, type INodeExecutionData } from 'n8n-workflow';
import { NodeExecuteFunctions } from 'n8n-core';
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

	async execute(this: NodeExecuteFunctions.IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Only intercept create operations to print a curl command
		if (operation === 'create') {
			if (resource === 'user') {
				// get credentials
				const creds = this.getCredentials('runrunitApi') as { appKey?: string; userToken?: string } | undefined;
				if (!creds) {
					throw new NodeOperationError(this.getNode(), 'Credentials `runrunitApi` are not set');
				}

				const appKey = creds.appKey || '';
				const userToken = creds.userToken || '';

				// get user object parameter (declared in resources/user/create.ts)
				const userObject = this.getNodeParameter('userObject', 0) as any;
				const makeEverybody = this.getNodeParameter('makeEverybodyMutualPartners', 0) as boolean | undefined;

				const body: any = { user: userObject };
				if (typeof makeEverybody !== 'undefined') {
					body.make_everybody_mutual_partners = makeEverybody;
				}

				const baseURL = (this.getNode().description.requestDefaults && (this.getNode().description.requestDefaults as any).baseURL) || 'https://runrun.it/api/v1.0';
				const path = '/users';

				const bodyString = JSON.stringify(body);
				// escape single quotes for inclusion in single-quoted shell string
				const escaped = bodyString.replace(/'/g, "'\"'\"'");

				const curl = `curl --location '${baseURL}${path}' \\
	--header 'App-Key: ${appKey}' \\
	--header 'User-Token: ${userToken}' \\
	--header 'Content-Type: application/json' \\
	--data-raw '${escaped}'`;

				return [[{ json: { curl } }]];
			}

			throw new NodeOperationError(this.getNode(), `Preview-curl for create not implemented for resource: ${resource}`);
		}

		throw new NodeOperationError(this.getNode(), 'This node currently only supports previewing curl for create operations.');
	}

}

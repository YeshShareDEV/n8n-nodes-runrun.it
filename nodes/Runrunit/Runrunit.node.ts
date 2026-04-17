import { NodeConnectionTypes, type INodeType, type INodeTypeDescription, NodeOperationError, type INodeExecutionData, type IExecuteFunctions } from 'n8n-workflow';
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
					{ name: 'User', value: 'user' },
					{ name: 'Task', value: 'task' },
					{ name: 'Team', value: 'team' },
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
			...userDescription,
			...taskDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

			if (operation === 'create') {
				const creds = (await this.getCredentials?.('runrunitApi')) as { appKey?: string; userToken?: string } | undefined;
				if (!creds) {
					throw new NodeOperationError(this.getNode(), 'Credentials `runrunitApi` are not set');
				}

				const appKey = creds.appKey || '';
				const userToken = creds.userToken || '';
				const mode = this.getNodeParameter('mode', 0) as string;
				const baseURL = 'https://runrun.it/api/v1.0';

				// Helper to parse JSON inputs safely
				const parseJsonInput = (paramName: string) => {
					const val = this.getNodeParameter(paramName, 0) as any;
					if (typeof val === 'string') {
						try {
							return JSON.parse(val);
						} catch (e) {
							throw new NodeOperationError(this.getNode(), `${paramName} inválido`);
						}
					}
					return val;
				};

				let path = '';
				let requestBody: any = {};

				switch (resource) {
					case 'user': {
						const userParsed = parseJsonInput('userObject');
						const makeEverybody = this.getNodeParameter('makeEverybodyMutualPartners', 0) as boolean | undefined;
						path = '/users';
						requestBody = { user: userParsed, make_everybody_mutual_partners: !!makeEverybody };
						break;
					}
					case 'clients': {
						const clientParsed = parseJsonInput('clientObject');
						path = '/clients';
						requestBody = { client: clientParsed };
						break;
					}
					case 'checklists': {
						const taskId = this.getNodeParameter('taskId', 0) as string;
						const checklistParsed = parseJsonInput('checklistObject');
						path = `/tasks/${taskId}/checklist`;
						requestBody = { checklist: checklistParsed };
						break;
					}
					case 'boardStage': {
						const boardId = this.getNodeParameter('boardId', 0) as string;
						const stageParsed = parseJsonInput('stageObject');
						path = `/boards/${boardId}/stages`;
						requestBody = { stage: stageParsed };
						break;
					}
					case 'descendants': {
						const taskId = this.getNodeParameter('taskId', 0) as string;
						const descendantParsed = parseJsonInput('descendantObject');
						path = `/tasks/${taskId}/descendants`;
						requestBody = { task: descendantParsed };
						break;
					}
					case 'comments': {
						const commentParsed = parseJsonInput('commentObject');
						path = '/comments';
						requestBody = { comment: commentParsed };
						break;
					}
					case 'checklistItems': {
						const checklistId = this.getNodeParameter('checklistId', 0) as string;
						const itemParsed = parseJsonInput('itemObject');
						path = `/checklists/${checklistId}/items`;
						requestBody = { checklist_item: itemParsed };
						break;
					}
					case 'task': {
						const taskParsed = parseJsonInput('taskObject');
						path = '/tasks';
						requestBody = { task: taskParsed };
						break;
					}
					case 'team': {
						const teamParsed = parseJsonInput('teamObject');
						path = '/teams';
						requestBody = { team: teamParsed };
						break;
					}
					case 'documents': {
						throw new NodeOperationError(this.getNode(), 'documents.create requires multipart upload and is not handled by this helper. Use the node UI binary upload or implement multipart handling.');
					}
					default: {
						throw new NodeOperationError(this.getNode(), `Create operation not yet implemented for resource: ${resource}`);
					}
				}

				if (mode === 'preview') {
					const bodyString = JSON.stringify(requestBody);
					const escaped = bodyString.replace(/'/g, "'\"'\"'");
					const curl = `curl --location '${baseURL}${path}' \\
					--header 'App-Key: ${appKey}' \\
					--header 'User-Token: ${userToken}' \\
					--header 'Content-Type: application/json' \\
					--data-raw '${escaped}'`;

					return [[{ json: { curl } }]];
				}

				try {
					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${baseURL}${path}`,
						body: requestBody,
						headers: {
							'App-Key': appKey,
							'User-Token': userToken,
							'Content-Type': 'application/json',
						},
						json: true,
					});

					return [[{ json: response }]];
				} catch (error: any) {
					const apiErrorMessage = error?.response?.body?.message || error?.message || 'Unknown error';
					const sentData = JSON.stringify(requestBody);
					let apiResponseBody = undefined;
					try {
						apiResponseBody = error?.response?.body ? JSON.stringify(error.response.body) : undefined;
					} catch (e) {
						apiResponseBody = String(error?.response?.body);
					}

					const finalMessage = `Erro Runrunit: "${apiErrorMessage}" | Payload enviado: ${sentData}` +
						(apiResponseBody ? ` | Response body: ${apiResponseBody}` : '');

					throw new NodeOperationError(this.getNode(), finalMessage, { itemIndex: 0 });
				}
			}
		throw new NodeOperationError(this.getNode(), 'This node currently only supports create operations.');
	}
}
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
			if (resource === 'user') {
				const creds = (await this.getCredentials?.('runrunitApi')) as { appKey?: string; userToken?: string } | undefined;
				if (!creds) {
					throw new NodeOperationError(this.getNode(), 'Credentials `runrunitApi` are not set');
				}

				const appKey = creds.appKey || '';
				const userToken = creds.userToken || '';
				const mode = this.getNodeParameter('mode', 0) as string;
				const userObject = this.getNodeParameter('userObject', 0) as any;
				const makeEverybody = this.getNodeParameter('makeEverybodyMutualPartners', 0) as boolean | undefined;

				const baseURL = 'https://runrun.it/api/v1.0';
				const path = '/users';

				// Desserialização de segurança: garantir que `userObject` seja um objeto
				let userParsed = userObject;
				if (typeof userObject === 'string') {
					try {
						userParsed = JSON.parse(userObject);
					} catch (e) {
						throw new NodeOperationError(this.getNode(), 'userObject inválido');
					}
				}

				const requestBody = {
					user: userParsed,
					make_everybody_mutual_partners: !!makeEverybody,
				};

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
			throw new NodeOperationError(this.getNode(), `Create operation not yet implemented for resource: ${resource}`);
		}
		throw new NodeOperationError(this.getNode(), 'This node currently only supports create operations.');
	}
}
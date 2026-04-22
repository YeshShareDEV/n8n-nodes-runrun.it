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

		if (operation === 'create') return await Runrunit.handleCreate(this, resource);
		if (operation === 'update') return await Runrunit.handleUpdate(this, resource);
		if (operation === 'get') return await Runrunit.handleGet(this, resource);
		if (operation === 'getAll') return await Runrunit.handleGetAll(this, resource);

		throw new NodeOperationError(this.getNode(), 'This node currently only supports create/update/get/getAll operations.');
	}

	private static async makeRequest(
		instance: IExecuteFunctions,
		method: string,
		path: string,
		body: any = {},
		qs: Record<string, any> = {},
	): Promise<any> {
		return (async () => {
			const creds = (await instance.getCredentials?.('runrunitApi')) as { appKey?: string; userToken?: string } | undefined;
			if (!creds) throw new NodeOperationError(instance.getNode(), 'Credentials `runrunitApi` are not set');

			const appKey = creds.appKey || '';
			const userToken = creds.userToken || '';
			const baseURL = 'https://runrun.it/api/v1.0';
			const mode = instance.getNodeParameter('mode', 0) as string;

			let url = `${baseURL}${path}`;
			if (qs && Object.keys(qs).length) {
				const params = new URLSearchParams();
				for (const k of Object.keys(qs)) params.append(k, String(qs[k]));
				url += `?${params.toString()}`;
			}

			if (mode === 'preview') {
				if (method.toUpperCase() === 'GET') {
					return { curl: `curl --location '${url}' \\n					--header 'App-Key: ${appKey}' \\n					--header 'User-Token: ${userToken}'` };
				}

				const bodyString = JSON.stringify(body);
				const escaped = bodyString.replace(/'/g, "'\"'\"'");
				return { curl: `curl --location '${url}' \\n				--header 'App-Key: ${appKey}' \\n				--header 'User-Token: ${userToken}' \\n				--header 'Content-Type: application/json' \\n				--data-raw '${escaped}'` };
			}

			try {
				const opts: any = { method, url, headers: { 'App-Key': appKey, 'User-Token': userToken }, json: true };
				if (method.toUpperCase() !== 'GET') {
					opts.body = body;
					opts.headers['Content-Type'] = 'application/json';
				}
				const response = await instance.helpers.httpRequest(opts);
				return response;
			} catch (error: any) {
				const apiErrorMessage = error?.response?.body?.message || error?.message || 'Unknown error';
				const sentData = method.toUpperCase() === 'GET' ? JSON.stringify(qs) : JSON.stringify(body);
				let apiResponseBody = undefined;
				try { apiResponseBody = error?.response?.body ? JSON.stringify(error.response.body) : undefined; } catch (e) { apiResponseBody = String(error?.response?.body); }
				const finalMessage = `Erro Runrunit: "${apiErrorMessage}" | Payload enviado: ${sentData}` + (apiResponseBody ? ` | Response body: ${apiResponseBody}` : '');
				throw new NodeOperationError(instance.getNode(), finalMessage, { itemIndex: 0 });
			}
		})();
	}

	private static parseJsonInput(instance: IExecuteFunctions, paramName: string) {
		const val = instance.getNodeParameter(paramName, 0) as any;
		if (typeof val === 'string') {
			try { return JSON.parse(val); } catch (e) { throw new NodeOperationError(instance.getNode(), `${paramName} inválido`); }
		}
		return val;
	}

	private static async handleCreate(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		let path = '';
		let requestBody: any = {};

		switch (resource) {
			case 'user': {
				const userParsed = Runrunit.parseJsonInput(instance, 'userObject');
				const makeEverybody = instance.getNodeParameter('makeEverybodyMutualPartners', 0) as boolean | undefined;
				path = '/users';
				requestBody = { user: userParsed, make_everybody_mutual_partners: !!makeEverybody };
				break;
			}
			case 'clients': {
				const clientParsed = Runrunit.parseJsonInput(instance, 'clientObject');
				path = '/clients';
				requestBody = { client: clientParsed };
				break;
			}
			case 'checklists': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				const checklistParsed = Runrunit.parseJsonInput(instance, 'checklistObject');
				path = `/tasks/${taskId}/checklist`;
				requestBody = { checklist: checklistParsed };
				break;
			}
			case 'boardStage': {
				const boardId = instance.getNodeParameter('boardId', 0) as string;
				const stageParsed = Runrunit.parseJsonInput(instance, 'stageObject');
				path = `/boards/${boardId}/stages`;
				requestBody = { stage: stageParsed };
				break;
			}
			case 'descendants': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				const descendantParsed = Runrunit.parseJsonInput(instance, 'descendantObject');
				path = `/tasks/${taskId}/descendants`;
				requestBody = { task: descendantParsed };
				break;
			}
			case 'comments': {
				const commentParsed = Runrunit.parseJsonInput(instance, 'commentObject');
				path = '/comments';
				requestBody = { comment: commentParsed };
				break;
			}
			case 'checklistItems': {
				const checklistId = instance.getNodeParameter('checklistId', 0) as string;
				const itemParsed = Runrunit.parseJsonInput(instance, 'itemObject');
				path = `/checklists/${checklistId}/items`;
				requestBody = { checklist_item: itemParsed };
				break;
			}
			case 'task': {
				const taskParsed = Runrunit.parseJsonInput(instance, 'taskObject');
				path = '/tasks';
				requestBody = { task: taskParsed };
				break;
			}
			case 'team': {
				const teamParsed = Runrunit.parseJsonInput(instance, 'teamObject');
				path = '/teams';
				requestBody = { team: teamParsed };
				break;
			}
			case 'documents': {
				throw new NodeOperationError(instance.getNode(), 'documents.create requires multipart upload and is not handled by this helper. Use the node UI binary upload or implement multipart handling.');
			}
			default: {
				throw new NodeOperationError(instance.getNode(), `Create operation not yet implemented for resource: ${resource}`);
			}
		}

		const resp = await Runrunit.makeRequest(instance, 'POST', path, requestBody);
		if (resp && resp.curl) return [[{ json: resp }]];
		return [[{ json: resp }]];
	}

	private static async handleUpdate(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		let path = '';
		let requestBody: any = {};

		switch (resource) {
			case 'user': {
				const userId = instance.getNodeParameter('userId', 0) as string;
				const userParsed = Runrunit.parseJsonInput(instance, 'userObject');
				const makeEverybody = instance.getNodeParameter('makeEverybodyMutualPartners', 0) as boolean | undefined;
				path = `/users/${userId}`;
				requestBody = { user: userParsed, make_everybody_mutual_partners: !!makeEverybody };
				break;
			}
			case 'clients': {
				const clientId = instance.getNodeParameter('clientId', 0) as string;
				const clientParsed = Runrunit.parseJsonInput(instance, 'clientObject');
				path = `/clients/${clientId}`;
				requestBody = { client: clientParsed };
				break;
			}
			case 'checklists': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				const checklistParsed = Runrunit.parseJsonInput(instance, 'checklistObject');
				path = `/tasks/${taskId}/checklist`;
				requestBody = { checklist: checklistParsed };
				break;
			}
			case 'boardStage': {
				const boardId = instance.getNodeParameter('boardId', 0) as string;
				const stageId = instance.getNodeParameter('stageId', 0) as string;
				const stageParsed = Runrunit.parseJsonInput(instance, 'stageObject');
				path = `/boards/${boardId}/stages/${stageId}`;
				requestBody = { stage: stageParsed };
				break;
			}
			case 'comments': {
				const commentId = instance.getNodeParameter('commentId', 0) as string;
				const commentParsed = Runrunit.parseJsonInput(instance, 'commentObject');
				path = `/comments/${commentId}`;
				requestBody = { comment: commentParsed };
				break;
			}
			case 'checklistItems': {
				const checklistId = instance.getNodeParameter('checklistId', 0) as string;
				const itemId = instance.getNodeParameter('itemId', 0) as string;
				const itemParsed = Runrunit.parseJsonInput(instance, 'itemObject');
				path = `/checklists/${checklistId}/items/${itemId}`;
				requestBody = { checklist_item: itemParsed };
				break;
			}
			case 'task': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				const taskParsed = Runrunit.parseJsonInput(instance, 'taskObject');
				path = `/tasks/${taskId}`;
				requestBody = { task: taskParsed };
				break;
			}
			case 'team': {
				const teamId = instance.getNodeParameter('teamId', 0) as string;
				const teamParsed = Runrunit.parseJsonInput(instance, 'teamObject');
				path = `/teams/${teamId}`;
				requestBody = { team: teamParsed };
				break;
			}
			case 'descriptions': {
				const descriptionParsed = Runrunit.parseJsonInput(instance, 'descriptionObject');
				path = `/descriptions`;
				requestBody = { description: descriptionParsed };
				break;
			}
			default: {
				throw new NodeOperationError(instance.getNode(), `Update operation not yet implemented for resource: ${resource}`);
			}
		}

		const resp = await Runrunit.makeRequest(instance, 'PUT', path, requestBody);
		if (resp && resp.curl) return [[{ json: resp }]];
		return [[{ json: resp }]];
	}

	private static async handleGet(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		let path = '';
		const qsObj: Record<string, any> = {};

		switch (resource) {
			case 'user': {
				const userId = instance.getNodeParameter('userId', 0) as string;
				path = `/users/${userId}`;
				break;
			}
			case 'clients': {
				const clientId = instance.getNodeParameter('clientId', 0) as string;
				path = `/clients/${clientId}`;
				break;
			}
			case 'comments': {
				const commentId = instance.getNodeParameter('commentId', 0) as string;
				path = `/comments/${commentId}`;
				break;
			}
			case 'checklistItems': {
				const checklistId = instance.getNodeParameter('checklistId', 0) as string;
				const itemId = instance.getNodeParameter('itemId', 0) as string;
				path = `/checklists/${checklistId}/items/${itemId}`;
				break;
			}
			case 'task': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				path = `/tasks/${taskId}`;
				break;
			}
			case 'team': {
				const teamId = instance.getNodeParameter('teamId', 0) as string;
				path = `/teams/${teamId}`;
				break;
			}
			case 'boardStage': {
				const boardId = instance.getNodeParameter('boardId', 0) as string;
				const stageId = instance.getNodeParameter('stageId', 0) as string;
				path = `/boards/${boardId}/stages/${stageId}`;
				break;
			}
			case 'documents': {
				const documentId = instance.getNodeParameter('documentId', 0) as string;
				path = `/documents/${documentId}`;
				break;
			}
			case 'descriptions': {
				const subjectType = instance.getNodeParameter('subject_type', 0) as string;
				const subjectId = instance.getNodeParameter('subject_id', 0) as string;
				path = '/descriptions';
				if (subjectType) qsObj.subject_type = subjectType;
				if (subjectId) qsObj.subject_id = subjectId;
				break;
			}
			default: {
				throw new NodeOperationError(instance.getNode(), `Get operation not yet implemented for resource: ${resource}`);
			}
		}

		const resp = await Runrunit.makeRequest(instance, 'GET', path, {}, qsObj);
		if (resp && resp.curl) return [[{ json: resp }]];
		return [[{ json: resp }]];
	}

	private static async handleGetAll(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		let path = '';
		const qs: Record<string, any> = {};

		// Global pagination handling
		const returnAll = instance.getNodeParameter('returnAll', 0) as boolean | undefined;
		if (returnAll) {
			qs.limit = 99999;
		} else {
			const limit = instance.getNodeParameter('limit', 0) as number | undefined;
			const page = instance.getNodeParameter('page', 0) as number | undefined;
			if (typeof limit !== 'undefined') qs.limit = limit;
			if (typeof page !== 'undefined') qs.page = page;
		}

		switch (resource) {
			case 'user': {
				path = '/users';
				const search = instance.getNodeParameter('search_term', 0) as string | undefined;
				if (search) qs.search_term = search;
				break;
			}
			case 'clients': {
				path = '/clients';
				break;
			}
			case 'task': {
				path = '/tasks';
				// support searching tasks as well
				const search = instance.getNodeParameter('search_term', 0) as string | undefined;
				if (search) qs.search_term = search;

				// Extract conditions and options safely (do not rely on routing)
				const conditions = instance.getNodeParameter('conditions', 0, {}) as any;
				const options = instance.getNodeParameter('options', 0, {}) as any;

				if (conditions) {
					// Helper for fixedCollection style entries
					const extractFields = (item: any) => (item && typeof item === 'object') ? (item.condition ?? item) : undefined;

					// If conditions is an array (fixedCollection in some UIs)
					if (Array.isArray(conditions)) {
						for (const c of conditions) {
							const fields = extractFields(c);
							if (fields) {
								if (typeof fields.project_id !== 'undefined' && fields.project_id !== '') qs.project_id = Number(fields.project_id);
								if (typeof fields.client_id !== 'undefined' && fields.client_id !== '') qs.client_id = Number(fields.client_id);
								if (typeof fields.responsible_id !== 'undefined' && fields.responsible_id !== '') qs.responsible_id = String(fields.responsible_id);
								if (typeof fields.is_closed !== 'undefined' && fields.is_closed !== '') qs.is_closed = !!fields.is_closed;
							}
						}
					} else if (typeof conditions === 'object') {
						// Defensive checks for older UI shapes: conditions.number / conditions.boolean / conditions.string
						if (conditions.number && Array.isArray(conditions.number)) {
							for (const filter of conditions.number) {
								const f = extractFields(filter) ?? filter;
								if (f) {
									if (typeof f.project_id !== 'undefined' && f.project_id !== '') qs.project_id = Number(f.project_id);
									if (typeof f.client_id !== 'undefined' && f.client_id !== '') qs.client_id = Number(f.client_id);
								}
							}
						}

						if (conditions.boolean && Array.isArray(conditions.boolean)) {
							for (const filter of conditions.boolean) {
								const f = extractFields(filter) ?? filter;
								if (f && typeof f.is_closed !== 'undefined' && f.is_closed !== '') qs.is_closed = !!f.is_closed;
							}
						}

						if (conditions.string && Array.isArray(conditions.string)) {
							for (const filter of conditions.string) {
								const f = extractFields(filter) ?? filter;
								if (f && typeof f.responsible_id !== 'undefined' && f.responsible_id !== '') qs.responsible_id = String(f.responsible_id);
							}
						}

						// Also support a direct object with fields
						const direct = extractFields(conditions) ?? conditions;
						if (direct && typeof direct === 'object') {
							if (typeof direct.project_id !== 'undefined' && direct.project_id !== '') qs.project_id = Number(direct.project_id);
							if (typeof direct.client_id !== 'undefined' && direct.client_id !== '') qs.client_id = Number(direct.client_id);
							if (typeof direct.responsible_id !== 'undefined' && direct.responsible_id !== '') qs.responsible_id = String(direct.responsible_id);
							if (typeof direct.is_closed !== 'undefined' && direct.is_closed !== '') qs.is_closed = !!direct.is_closed;
						}
					}
				}

				// Map any simple options into query string safely (keeps extraction isolated)
				if (options && typeof options === 'object' && Object.keys(options).length) {
					for (const key of Object.keys(options)) {
						const val = (options as any)[key];
						if (typeof val !== 'undefined' && val !== '') {
							qs[key] = val;
						}
					}
				}
				break;
			}
			case 'comments': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				path = `/tasks/${taskId}/comments`;
				break;
			}
			case 'documents': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				path = `/tasks/${taskId}/documents`;
				break;
			}
			case 'checklistItems': {
				const checklistId = instance.getNodeParameter('checklistId', 0) as string;
				path = `/checklists/${checklistId}/items`;
				break;
			}
			case 'descendants': {
				const taskId = instance.getNodeParameter('taskId', 0) as string;
				path = `/tasks/${taskId}/descendants`;
				break;
			}
			case 'team': {
				path = '/teams';
				break;
			}
			case 'boardStage': {
				const boardId = instance.getNodeParameter('boardId', 0) as string;
				path = `/boards/${boardId}/stages`;
				break;
			}
			default: {
				throw new NodeOperationError(instance.getNode(), `GetAll operation not yet implemented for resource: ${resource}`);
			}
		}

		const resp = await Runrunit.makeRequest(instance, 'GET', path, {}, qs);
		if (resp && resp.curl) return [[{ json: resp }]];
		return [[{ json: resp }]];
	}

}

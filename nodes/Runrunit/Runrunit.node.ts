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
		const returnData: INodeExecutionData[] = [];
		const inputCount = Math.max(1, instance.getInputData().length);

		for (let i = 0; i < inputCount; i++) {
			let path = '';
			const qs: Record<string, any> = {};

			// Per-item pagination handling (capture parameters using index `i`)
			const returnAll = instance.getNodeParameter('returnAll', i) as boolean | undefined;
			if (returnAll) {
				qs.limit = 99999;
			} else {
				const limit = instance.getNodeParameter('limit', i) as number | undefined;
				const page = instance.getNodeParameter('page', i) as number | undefined;
				if (typeof limit !== 'undefined') qs.limit = limit;
				if (typeof page !== 'undefined') qs.page = page;
			}

			switch (resource) {
				case 'user': {
					path = '/users';
					const search = instance.getNodeParameter('search_term', i) as string | undefined;
					if (search) qs.search_term = search;
					break;
				}
				case 'clients': {
					path = '/clients';
					break;
				}
				case 'task': {
					path = '/tasks';
					const search = instance.getNodeParameter('search_term', i) as string | undefined;
					if (search) qs.search_term = search;

					try {
						const projectId = instance.getNodeParameter('project_id', i) as number | undefined;
						if (typeof projectId !== 'undefined' && Number(projectId) > 0) qs.project_id = projectId;

						const responsibleId = instance.getNodeParameter('responsible_id', i) as string | undefined;
						if (typeof responsibleId === 'string' && responsibleId.trim() !== '') qs.responsible_id = responsibleId.trim();

						const isClosed = instance.getNodeParameter('is_closed', i) as string | undefined;
						if (isClosed === 'true') {
							qs.is_closed = true;
						} else if (isClosed === 'false') {
							qs.is_closed = false;
						} else if (isClosed === 'all') {
							qs.bypass_status_default = true;
						}
					} catch (e) {
						// ignore malformed params
					}
					break;
				}
				case 'comments': {
					const taskId = instance.getNodeParameter('taskId', i) as string;
					path = `/tasks/${taskId}/comments`;
					break;
				}
				case 'documents': {
					const taskId = instance.getNodeParameter('taskId', i) as string;
					path = `/tasks/${taskId}/documents`;
					break;
				}
				case 'checklistItems': {
					const checklistId = instance.getNodeParameter('checklistId', i) as string;
					path = `/checklists/${checklistId}/items`;
					break;
				}
				case 'descendants': {
					const taskId = instance.getNodeParameter('taskId', i) as string;
					path = `/tasks/${taskId}/descendants`;
					break;
				}
				case 'team': {
					path = '/teams';
					break;
				}
				case 'boardStage': {
					const boardId = instance.getNodeParameter('boardId', i) as string;
					path = `/boards/${boardId}/stages`;
					break;
				}
				default: {
					throw new NodeOperationError(instance.getNode(), `GetAll operation not yet implemented for resource: ${resource}`);
				}
			}

			const resp = await Runrunit.makeRequest(instance, 'GET', path, {}, qs);
			if (resp && resp.curl) return [[{ json: resp }]];

			let parsedResp: any = resp;
			if (typeof resp === 'string') {
				try { parsedResp = JSON.parse(resp); } catch (e) { parsedResp = resp; }
			}

			let normalizedArray: any[] = [];
			if (Array.isArray(parsedResp)) {
				normalizedArray = parsedResp;
			} else if (parsedResp && typeof parsedResp === 'object') {
				const arr = parsedResp.tasks || parsedResp.data || parsedResp.items;
				if (Array.isArray(arr)) normalizedArray = arr;
				else normalizedArray = [parsedResp];
			} else {
				normalizedArray = [parsedResp];
			}

			const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
			let postItems: INodeExecutionData[] = items.map((it) => ({ json: JSON.parse(JSON.stringify(it.json)), binary: it.binary ? { ...it.binary } : undefined }));

			const options = instance.getNodeParameter('options', i) as any || {};
			const conditions = (instance.getNodeParameter('conditions', i) as any) || {};

			// Configure root-level flags on conditions
			conditions.caseSensitive = !!(options && options.ignoreCase === false);
			conditions.typeValidation = options && options.looseTypeValidation ? 'loose' : 'strict';

			console.log(`Runrunit: task.getAll — items before filter: ${postItems.length}`);
			console.log('Runrunit: active filter rules:', conditions);

			let finalItems: INodeExecutionData[] = postItems;
			try {
				const helper = (instance.helpers as any).filterInputData as any;
				if (typeof helper === 'function') {
					const filtered = helper(postItems, conditions as any);
					if (Array.isArray(filtered)) finalItems = filtered as INodeExecutionData[];
					else if (filtered && Array.isArray(filtered.filteredItems)) finalItems = filtered.filteredItems as INodeExecutionData[];
				}
			} catch (err) {
				console.warn('Runrunit: filterInputData failed, returning unfiltered items', err);
				finalItems = postItems;
			}

			console.log(`Runrunit: task.getAll — items after filter: ${finalItems.length}`);

			for (const it of finalItems) returnData.push(it);
		}

		return [returnData];
	}

}
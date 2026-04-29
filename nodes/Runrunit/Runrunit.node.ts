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
				return { curl: `curl --location '${url}' --header 'App-Key: ${appKey}' --header 'User-Token: ${userToken}'` };
			}
			const bodyString = JSON.stringify(body).replace(/'/g, "'\"'\"'");
			return { curl: `curl --location '${url}' --header 'App-Key: ${appKey}' --header 'User-Token: ${userToken}' --header 'Content-Type: application/json' --data-raw '${bodyString}'` };
		}

		try {
			const opts: any = { method, url, headers: { 'App-Key': appKey, 'User-Token': userToken }, json: true };
			if (method.toUpperCase() !== 'GET') {
				opts.body = body;
				opts.headers['Content-Type'] = 'application/json';
			}
			return await instance.helpers.httpRequest(opts);
		} catch (error: any) {
			const apiErrorMessage = error?.response?.body?.message || error?.message || 'Unknown error';
			throw new NodeOperationError(instance.getNode(), `Erro Runrunit: "${apiErrorMessage}"`, { itemIndex: 0 });
		}
	}

	/*
	private static parseJsonInput(instance: IExecuteFunctions, paramName: string) {
		const val = instance.getNodeParameter(paramName, 0) as any;
		if (typeof val === 'string') {
			try { return JSON.parse(val); } catch (e) { throw new NodeOperationError(instance.getNode(), `${paramName} inválido`); }
		}
		return val;
	}*/

	private static async handleCreate(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const inputData = instance.getInputData();

		for (let i = 0; i < inputData.length; i++) {
			let path = '';
			let body: any = {};

			if (resource === 'user') {
				path = '/users';
				// 1. Vai buscar o objeto JSON que o utilizador preencheu na UI
				const userPayload = instance.getNodeParameter('userObject', i) as any;

				// 2. Se for uma string (texto puro), transforma em objeto JSON real
				const userData = typeof userPayload === 'string' ? JSON.parse(userPayload) : userPayload;

				// 3. Monta o corpo conforme a API espera (envolvido na chave 'user' ou direto)
				body = {
					user: userData,
					make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', i),
				};
			} else if (resource === 'task') {
				path = '/tasks';
				// Repita a lógica para buscar os parâmetros de task aqui
			}

			// Garante que o path não está vazio antes de enviar (evita o 404)
			if (path) {
				const resp = await Runrunit.makeRequest(instance, 'POST', path, body);
				returnData.push({ json: resp });
			}
		}
		return [returnData];
	}

	private static async handleUpdate(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const inputData = instance.getInputData();

		for (let i = 0; i < inputData.length; i++) {
			let path = '';
			let body: any = {};

			if (resource === 'user') {
				// 1. Pega o ID para montar a URL: /users/{id}
				const userId = instance.getNodeParameter('userId', i) as string;
				path = `/users/${userId}`;

				// 2. Trata o objeto JSON (userObject)
				const userPayload = instance.getNodeParameter('userObject', i) as any;
				const userData = typeof userPayload === 'string' ? JSON.parse(userPayload) : userPayload;

				// 3. Monta o corpo conforme definido no seu update.ts
				body = {
					user: userData,
					make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', i),
				};
			} else if (resource === 'task') {
				const taskId = instance.getNodeParameter('taskId', i) as string;
				path = `/tasks/${taskId}`;
				// lógica de body para task...
			}

			if (!path) throw new NodeOperationError(instance.getNode(), `Caminho de update não definido para: ${resource}`);

			// 4. Executa o PUT
			const resp = await Runrunit.makeRequest(instance, 'PUT', path, body);
			returnData.push({ json: resp });
		}

		return [returnData];
	}

	private static async handleGet(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const inputData = instance.getInputData();

		for (let i = 0; i < inputData.length; i++) {
			let path = '';
			const qsObj: Record<string, any> = {};

			if (resource === 'user') {
				// Captura o ID do campo definido no get.ts
				const userId = instance.getNodeParameter('userId', i) as string;

				if (!userId) {
					throw new NodeOperationError(instance.getNode(), 'O campo User ID é obrigatório para a operação Get.');
				}

				// Monta o caminho dinâmico para a API: /users/{id}
				path = `/users/${userId}`;
			} else if (resource === 'task') {
				const taskId = instance.getNodeParameter('taskId', i) as string;
				path = `/tasks/${taskId}`;
			}

			// Se o path não foi definido, pula para a próxima entrada
			if (!path) continue;

			// Faz a requisição GET
			const resp = await Runrunit.makeRequest(instance, 'GET', path, {}, qsObj);
			returnData.push({ json: resp });
		}

		return [returnData];
	}

	private static async handleGetAll(instance: IExecuteFunctions, resource: string): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const inputCount = Math.max(1, instance.getInputData().length);

		for (let i = 0; i < inputCount; i++) {
			let path = '';
			const qs: Record<string, any> = {};

			const returnAll = instance.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) {
				qs.limit = 1000;
			} else {
				qs.limit = instance.getNodeParameter('limit', i, 50);
				qs.page = instance.getNodeParameter('page', i, 1);
			}

			if (resource === 'task') {
				path = '/tasks';

				const search = instance.getNodeParameter('search_term', i, '') as string;
				if (search) qs.search_term = search;

				const projectId = instance.getNodeParameter('project_id', i, 0) as number;
				if (projectId !== 0) qs.project_id = projectId;

				const responsibleId = instance.getNodeParameter('responsible_id', i, '') as string;
				if (responsibleId) qs.responsible_id = responsibleId;

				const isClosed = instance.getNodeParameter('is_closed', i, 'all') as string;
				if (isClosed !== 'all') qs.is_closed = isClosed;

			} else if (resource === 'clients') {
				path = '/clients';
			}

			const resp = await Runrunit.makeRequest(instance, 'GET', path, {}, qs);

			let normalizedArray: any[] = [];
			if (Array.isArray(resp)) normalizedArray = resp;
			else if (resp && typeof resp === 'object') {
				normalizedArray = resp.tasks || resp.data || resp.items || [resp];
			}

			const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));

			// Safe deep-clone for post-filter input to avoid side-effects
			const postItems: INodeExecutionData[] = items.map((it) => ({ json: JSON.parse(JSON.stringify(it.json)), binary: it.binary ? { ...it.binary } : undefined }));

			// Try to read `conditions` and `options` params safely — some node versions may not have them
			let rawConditions: any = {};
			let uiOptions: any = {};
			try {
				rawConditions = instance.getNodeParameter('conditions', i) as any || {};
			} catch (e) {
				rawConditions = {};
			}
			try {
				uiOptions = instance.getNodeParameter('options', i) as any || {};
			} catch (e) {
				uiOptions = {};
			}

			let finalItems: INodeExecutionData[] = postItems;

			const providedConditions = rawConditions.conditions ?? rawConditions.filter ?? rawConditions;
			const hasConditions = providedConditions && ((Array.isArray(providedConditions) && providedConditions.length > 0) || (typeof providedConditions === 'object' && Object.keys(providedConditions).length > 0));

			if (hasConditions) {
				try {
					const filterHelper = (instance.helpers as any)?.filterInputData;
					if (typeof filterHelper === 'function') {
						if (!rawConditions.filter) rawConditions.filter = {};
						if (typeof rawConditions.filter.caseSensitive === 'undefined') rawConditions.filter.caseSensitive = !uiOptions.ignoreCase;
						if (typeof rawConditions.filter.typeValidation === 'undefined') rawConditions.filter.typeValidation = uiOptions.looseTypeValidation ? 'loose' : 'strict';

						const payload = {
							conditions: providedConditions,
							combinator: rawConditions.combinator ?? 'and',
							options: {
								caseSensitive: !!rawConditions.filter.caseSensitive,
								typeValidation: rawConditions.filter.typeValidation,
							},
						};

						const result = await (filterHelper as any).call(instance, postItems, payload);
						if (Array.isArray(result)) finalItems = result;
						else if (result && Array.isArray(result.filteredItems)) finalItems = result.filteredItems;
					}
				} catch (err: any) {
					// do not break execution on filter errors
					// eslint-disable-next-line no-console
					console.error('Runrunit: erro ao aplicar post-filter conditions:', err?.message ?? err);
					finalItems = postItems;
				}
			} else {
				// Fallback: apply existing fixedCollection `filters` if present
				const filtersCollection = ((): { filter?: Array<{ field: string; operator: string; value: string }> } => {
					try {
						return instance.getNodeParameter('filters', i) as any;
					} catch (e) {
						return { filter: [] };
					}
				})();
				const filters = filtersCollection?.filter ?? [];

				if (filters.length > 0) {
					finalItems = postItems.filter((item) => {
						const json = item.json as Record<string, any>;

						return filters.every((f) => {
							const itemValue = json[f.field];
							const filterValue = f.value;

							if (f.operator === 'equals') return String(itemValue) === String(filterValue);
							if (f.operator === 'contains') return String(itemValue).includes(filterValue);
							if (f.operator === 'gt') return Number(itemValue) > Number(filterValue);
							if (f.operator === 'lt') return Number(itemValue) < Number(filterValue);
							if (f.operator === 'isTrue') return itemValue === true || itemValue === 'true';
							if (f.operator === 'isFalse') return itemValue === false || itemValue === 'false';
							return true;
						});
					});
				}
			}

			for (const it of finalItems) returnData.push(it);
		}

		return [returnData];
	}
}
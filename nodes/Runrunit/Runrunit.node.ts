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

	// Runrunit.node.ts - Excerto corrigido do método handleGetAll
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

				// Filtros nativos extraídos do seu arquivo getAll.ts
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

			// Exibe o retorno bruto no log do servidor n8n

			let normalizedArray: any[] = [];
			if (Array.isArray(resp)) normalizedArray = resp;
			else if (resp && typeof resp === 'object') {
				normalizedArray = resp.tasks || resp.data || resp.items || [resp];
			}

			const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));

			// --- LÓGICA DE FILTRO CORRIGIDA ---
			const uiOptions = instance.getNodeParameter('options', i) as any || {};
			const rawConditions = instance.getNodeParameter('conditions', i) as any || {};

			console.log('--- DEBUG FILTROS ---');
			console.log('Raw Conditions:', JSON.stringify(rawConditions, null, 2));
			console.log('Conditions:', JSON.stringify(rawConditions.conditions, null, 2));
			console.log('teste:', rawConditions.conditions && rawConditions.conditions.length > 0);

			let finalItems: INodeExecutionData[] = items;

			if (rawConditions.conditions && rawConditions.conditions.length > 0) {
				try {
					const filterHelper = (instance.helpers as any).filterInputData;
					if (typeof filterHelper === 'function') {
						const filterPayload = {
							conditions: rawConditions.conditions,
							combinator: rawConditions.combinator || 'and',
							options: {
								caseSensitive: !!(uiOptions.ignoreCase !== false),
								typeValidation: uiOptions.looseTypeValidation ? 'loose' : 'strict',
							}
						};
						const result = filterHelper(items, filterPayload);
						finalItems = Array.isArray(result) ? result : (result.filteredItems || []);
					}
				} catch (err) {
					console.log('Runrunit: Falha no helper de filtro:', err);
				}
			}

			for (const it of finalItems) returnData.push(it);
		}
		return [returnData];
	}
}
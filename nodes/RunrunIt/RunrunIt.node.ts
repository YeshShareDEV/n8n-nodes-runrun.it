import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	IHttpRequestOptions,
} from 'n8n-workflow';

// Guarded/dynamic loading of descriptions to avoid package-load errors
declare const require: any;
let taskOperations: any[] = [];
let taskFields: any[] = [];
try {
	const desc = require('./descriptions/TaskDescription');
	taskOperations = desc.taskOperations || [];
	taskFields = desc.taskFields || [];
} catch (e) {
	// If descriptions can't be loaded at package-install time,
	// keep empty arrays so the node file still loads.
}

// Inline runrunitApiRequest to remove dependency on external transport import
export async function runrunitApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	path: string,
	data?: any,
	params?: any,
) {
	const BASE_URL = 'https://runrun.it';

	const credentials = await this.getCredentials('runrunitApi') as {
		appKey?: string;
		userToken?: string;
	};

	if (!credentials || !credentials.appKey || !credentials.userToken) {
		throw new Error('Runrun.it credentials are missing (appKey/userToken)');
	}

	const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

	const headers = {
		'App-Key': credentials.appKey,
		'User-Token': credentials.userToken,
		'Content-Type': 'application/json',
		Accept: 'application/json',
	} as Record<string, string>;

	const options: IHttpRequestOptions = {
		method: method as any,
		url,
		headers,
		json: true,
	};

	if (typeof data !== 'undefined') {
		options.body = data;
	}

	if (typeof params !== 'undefined') {
		options.qs = params;
	}

	return await this.helpers.httpRequest(options);
}

export class RunrunIt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Runrun.it',
		name: 'runrunit',
		icon: 'file:runrunit.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Runrun.it API',
		defaults: {
			name: 'Runrun.it',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'runrunitApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Task', value: 'task' },
				],
				default: 'task',
			} as INodeProperties,
			...taskOperations,
			...taskFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: any[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				if (resource === 'task') {
					if (operation === 'list') {
						const page = this.getNodeParameter('page', i, undefined) as number | undefined;
						const limit = this.getNodeParameter('limit', i, undefined) as number | undefined;
						const qs: any = {};
						if (page) qs.page = page;
						if (limit) qs.limit = limit;
						// Agora usando .call(this) para passar o contexto do n8n
						const resp = await runrunitApiRequest.call(this, 'GET', '/api/v1.0/tasks', undefined, qs);
						returnData.push(resp);
					} 
					
					else if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as string | number;
						const resp = await runrunitApiRequest.call(this, 'GET', `/api/v1.0/tasks/${taskId}`);
						returnData.push(resp);
					} 
					
					else if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const body: any = { task: { title } };
						
						// Helpers para simplificar a captura de parâmetros opcionais
						const optionalParams = [
							'project_id', 'description', 'assignee_id', 
							'desired_start_date', 'desired_date', 'task_type_id'
						];
						
						for (const param of optionalParams) {
							try {
								const value = this.getNodeParameter(param, i);
								if (value) body.task[param === 'description' ? 'content' : param] = value;
							} catch (e) {}
						}

						const resp = await runrunitApiRequest.call(this, 'POST', '/api/v1.0/tasks', body);
						returnData.push(resp);
					}
					
					// ... (mantenha os outros else ifs usando .call(this) como você já começou a fazer)
					
					else if (operation === 'delete') {
						const taskId = this.getNodeParameter('taskId', i) as string | number;
						const resp = await runrunitApiRequest.call(this, 'DELETE', `/api/v1.0/tasks/${taskId}`);
						returnData.push(resp);
					}
					
					// Para operações genéricas de POST (play, pause, etc)
					const genericPostOps = ['play', 'pause', 'deliver', 'reopen', 'mark_as_urgent', 'unmark_as_urgent'];
					if (genericPostOps.includes(operation)) {
						const taskId = this.getNodeParameter('taskId', i) as string | number;
						const resp = await runrunitApiRequest.call(this, 'POST', `/api/v1.0/tasks/${taskId}/${operation}`);
						returnData.push(resp);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
					returnData.push({ error: errMsg });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
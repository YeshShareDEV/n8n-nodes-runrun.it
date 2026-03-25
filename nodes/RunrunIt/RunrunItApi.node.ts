import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, ApplicationError, NodeOperationError } from 'n8n-workflow';
import { TasksDescription } from './resources/Tasks';

// Default templates used when `Input (raw)` is empty and `sendRawBody` is enabled.
const DEFAULT_RAW_TEMPLATES: Record<string, IDataObject> = {
	'Administration/User': {
		id: 132,
		username: 'teste2@teste.com',
		realname: 'Teste inclusão',
		firstname: 'Teste',
		password: '123456',
		password2: '123456',
		phone: '',
		phone2: '',
		mobile: '',
		emails: [{ email: 'teste1@teste.com', is_default: true, is_dynamic: true }],
		comment: 'string',
		is_active: true,
		is_deleted: false,
		picture: null,
		date_password_change: '2024-08-07T04:46:21+00:00',
		authtype: 1,
		last_login: '2026-03-06T12:16:33+00:00',
		location: { id: 0 },
		default_profile: { id: 1 },
		default_entity: { id: 0, name: 'Entidade raiz' },
	},
	'Tasks': {
		name: 'Teste000000',
		comment: '',
		contact: 'Teste CONTACT',
		contact_num: null,
		serial: 'TESTE0001',
		otherserial: null,
		is_deleted: false,
		status: { id: 1, name: 'ATIVO' },
		location: { id: 1, name: 'YESHGRU' },
		entity: { id: 0, name: 'Entidade raiz', completename: 'Entidade raiz' },
		type: { id: 1, name: 'Notebook' },
		manufacturer: { id: 87, name: 'Acer' },
		model: { id: 4, name: 'TESTE' },
		user: { id: 167, name: 'Teste' },
		user_tech: null,
		group: [],
		group_tech: [],
		network: { id: 1, name: 'Sala dos Leões GRU' },
		autoupdatesystem: { id: 1, name: 'Runrun.it Native Inventory' },
	},
};

// Helper: consider null/undefined or an empty plain object as "empty".
function isEmptyObject(obj: any): boolean {
	if (obj === null || obj === undefined) return true;
	if (typeof obj === 'object' && !Array.isArray(obj)) {
		try {
			return Object.keys(obj).length === 0;
		} catch {
			return true;
		}
	}
	return false;
}

// Garante e normaliza a base URL terminando em /api.php
function buildBaseUrl(host?: string) {
	let baseUrl = (host || '').trim();

	if (baseUrl.length === 0) return '';

	// Ensure scheme for URL parsing
	if (!/^https?:\/\//i.test(baseUrl)) {
		baseUrl = `https://${baseUrl}`;
	}

	try {
		// Avoid relying on the global URL constructor or require('url') to keep
		// TypeScript builds portable. Parse origin and path with regex.
		const originMatch = baseUrl.match(/^(https?:\/\/[^\/]+)/i);
		const origin = originMatch ? originMatch[1] : '';

		// Find /api.php or /apirest.php in the provided URL (case-insensitive)
		const apiMatch = baseUrl.match(/\/(?:apirest|api)\.php/i);
		if (origin) {
			if (apiMatch) {
				return `${origin}${apiMatch[0]}`;
			}
			return `${origin}/api.php`;
		}

		// If we couldn't extract origin, fall back to a safe heuristic
		baseUrl = baseUrl.replace(/\/apirest\.php\/?/i, '');
		baseUrl = baseUrl.replace(/\/+$/g, '');
		if (!baseUrl.endsWith('/api.php')) {
			baseUrl = `${baseUrl}/api.php`;
		}
		return baseUrl;
	} catch (e) {
		baseUrl = baseUrl.replace(/\/apirest\.php\/?/i, '');
		baseUrl = baseUrl.replace(/\/+$/g, '');
		if (!baseUrl.endsWith('/api.php')) {
			baseUrl = `${baseUrl}/api.php`;
		}
		return baseUrl;
	}
}

// Faz a solicitação do token (login) por password grant
async function getOAuthToken(
	this: IExecuteFunctions,
	baseUrl: string,
	clientId: string,
	clientSecret: string,
	username?: string,
	password?: string,
	scope?: string,
	authorizationCode?: string,
	redirectUri?: string,
): Promise<string> {
	try {
		const body: any = authorizationCode
			? {
				  grant_type: 'authorization_code',
				  client_id: clientId,
				  client_secret: clientSecret,
				  code: authorizationCode,
				  redirect_uri: redirectUri,
			  }
			: {
				  grant_type: 'password',
				  client_id: clientId,
				  client_secret: clientSecret,
				  username,
				  password,
				  scope,
			  };

		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/token`,
			headers: {
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		});

		const token = response?.session_token || response?.access_token;

		if (!token) {
			throw new ApplicationError('Failed to login to Runrun.it: session_token/access_token not found in response', {
				level: 'warning',
			});
		}

		return token;
	} catch (error) {
		if (error && typeof error === 'object' && 'response' in error) {
			const httpError = error as { response: { status: number; statusText: string } };
			throw new ApplicationError(
				`Failed to login to Runrun.it: ${httpError.response.status} ${httpError.response.statusText}. Check your credentials and URL.`,
				{ level: 'error' },
			);
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new ApplicationError(`Failed to login to Runrun.it: ${errorMessage}`, { level: 'error' });
	}
}

export class Runrunit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Runrun.it API (Fork)',
		name: 'runrunitFork',
		icon: 'file:runrunit.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Runrun.it API Node compatible with Runrun.it REST API.',
		defaults: {
			name: 'Runrun.it API',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		// eslint-disable-next-line @n8n/community-nodes/no-credential-reuse
		credentials: [{ name: 'runrunitApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Tasks', value: 'Tasks' },
				],
				default: 'Tasks',
			},
			{
				displayName: 'Show Credentials Only',
				name: 'showCredentials',
				type: 'boolean',
				default: false,
				description: 'If enabled, the node will output the configured credentials and skip any API requests.',
			},

			// 'Limit' field removed from main node properties.
			...TasksDescription,
		],
	};
		methods: INodeType['methods'] = {},

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const creds = await this.getCredentials('runrunitApi');

		const baseUrl = buildBaseUrl(creds.host as string);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				let itemtype: string = (this.getNodeParameter('itemtype', itemIndex) as string) || 'Tasks';
				if (itemtype && !itemtype.includes('/')) itemtype = `Tasks/${itemtype}`;

				const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;

				let token = '';
				try {
					token = await getOAuthToken.call(
						this,
						baseUrl,
						creds.clientId as string,
						creds.clientSecret as string,
						creds.username as string,
						creds.password as string,
						(creds.scope as string) || undefined,
						(creds.useAuthorizationCode as boolean) ? (creds.authorizationCode as string) : undefined,
						(creds.redirectUri as string) || undefined,
					);
				} catch (err) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: err instanceof Error ? err.message : String(err) }, pairedItem: { item: itemIndex } });
						continue;
					}
					throw err;
				}

				const headers: { [key: string]: string } = { Authorization: `Bearer ${token}` };
				let options: IHttpRequestOptions | undefined;

				if (operation === 'get') {
					const id = this.getNodeParameter('itemid', itemIndex, '') as string | number;
					let url = `${baseUrl}/${itemtype}${id ? '/' + id : ''}`;
					if (!id && returnAll === false) {
						const params: string[] = [];
						const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
						params.push(`limit=${limit}`);
						const filtersParam = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
						const filterStr = (filtersParam && (filtersParam as any).filter) || '';
						if (filterStr) params.push(`filter=${encodeURIComponent(filterStr)}`);
						if (params.length) url += (url.includes('?') ? '&' : '?') + params.join('&');
					}
					options = { method: 'GET' as IHttpRequestMethods, url, headers, json: true };
				} else if (operation === 'create') {
					const rawInputParam = this.getNodeParameter('input', itemIndex, {}) as any;
					let rawInput: IDataObject = rawInputParam as IDataObject;
					if (typeof rawInputParam === 'string') {
						try {
							rawInput = JSON.parse(rawInputParam) as IDataObject;
						} catch (e) {
							if (this.continueOnFail()) {
								returnData.push({ json: { error: 'Invalid JSON in Input (raw)' }, pairedItem: { item: itemIndex } });
								continue;
							}
							throw new ApplicationError('Invalid JSON in Input (raw)', { level: 'error' });
						}
					}
					const sendRawBody = this.getNodeParameter('sendRawBody', itemIndex, true) as boolean;
					if (sendRawBody && isEmptyObject(rawInput)) {
						if (sendRawBody && DEFAULT_RAW_TEMPLATES['Tasks']) {
							rawInput = DEFAULT_RAW_TEMPLATES['Tasks'];
						} else {
							if (this.continueOnFail()) {
								returnData.push({ json: { error: 'Input (raw) is required when creating Tasks' }, pairedItem: { item: itemIndex } });
								continue;
							}
							throw new ApplicationError('Input (raw) is required when creating Tasks', { level: 'error' });
						}
					}
					const bodyToSend = sendRawBody && !isEmptyObject(rawInput) ? rawInput : { input: rawInput };
					options = { method: 'POST' as IHttpRequestMethods, url: `${baseUrl}/${itemtype}`, headers, body: bodyToSend, json: true };
				} else if (operation === 'update') {
					const id = this.getNodeParameter('itemid', itemIndex);
					const idValue: any = id;
					const idNum = typeof idValue === 'string' ? (idValue === '' ? NaN : Number(idValue)) : Number(idValue);
					if (!idValue || Number.isNaN(idNum) || idNum === 0) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: 'Item ID (itemid) is required and must be a positive number for update operations' }, pairedItem: { item: itemIndex } });
							continue;
						}
						throw new ApplicationError('Item ID (itemid) is required and must be a positive number for update operations', { level: 'error' });
					}
					const rawInputParam = this.getNodeParameter('input', itemIndex, {}) as any;
					let rawInput: any = rawInputParam;
					if (typeof rawInputParam === 'string') {
						try {
							rawInput = JSON.parse(rawInputParam);
						} catch (e) {
							if (this.continueOnFail()) {
								returnData.push({ json: { error: 'Invalid JSON in Input (raw)' }, pairedItem: { item: itemIndex } });
								continue;
							}
							throw new ApplicationError('Invalid JSON in Input (raw)', { level: 'error' });
						}
					}
					const sendRawBody = this.getNodeParameter('sendRawBody', itemIndex, true) as boolean;
					if (sendRawBody && isEmptyObject(rawInput)) {
						if (DEFAULT_RAW_TEMPLATES['Tasks']) rawInput = DEFAULT_RAW_TEMPLATES['Tasks'];
					}
					const bodyToSend = sendRawBody && !isEmptyObject(rawInput) ? rawInput : { input: rawInput };
					options = { method: 'PATCH' as IHttpRequestMethods, url: `${baseUrl}/${itemtype}/${id}`, headers, body: bodyToSend, json: true };
				} else if (operation === 'delete') {
					const id = this.getNodeParameter('itemid', itemIndex);
					const idValueDel: any = id;
					const idNumDel = typeof idValueDel === 'string' ? (idValueDel === '' ? NaN : Number(idValueDel)) : Number(idValueDel);
					if (!idValueDel || Number.isNaN(idNumDel) || idNumDel === 0) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: 'Item ID (itemid) is required and must be a positive number for delete operations' }, pairedItem: { item: itemIndex } });
							continue;
						}
						throw new ApplicationError('Item ID (itemid) is required and must be a positive number for delete operations', { level: 'error' });
					}
					options = { method: 'DELETE' as IHttpRequestMethods, url: `${baseUrl}/${itemtype}/${id}`, headers, json: true };
				} else {
					throw new ApplicationError(`Unknown operation: ${operation}`, { level: 'warning' });
				}

				const showCredentials = this.getNodeParameter('showCredentials', itemIndex, false) as boolean;
				if (options && (options as IHttpRequestOptions).body !== undefined) {
					options.headers = { ...(options.headers || {}), 'Content-Type': 'application/json' };
				}

				if (showCredentials) {
					returnData.push({
						json: {
							host: creds.host,
							baseUrl,
							clientId: creds.clientId,
							clientSecret: creds.clientSecret,
							username: creds.username,
							password: creds.password,
							scope: creds.scope,
						},
						pairedItem: { item: itemIndex },
					});
				} else {
					const response = await this.helpers.httpRequest(options as any);
					if (Array.isArray(response)) {
						let outputArray = response;
						if (returnAll === false) {
							const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
							outputArray = outputArray.slice(0, limit);
						}
						for (const resItem of outputArray) {
							returnData.push({ json: resItem, pairedItem: { item: itemIndex } });
						}
					} else {
						returnData.push({ json: response, pairedItem: { item: itemIndex } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error instanceof Error ? error.message : String(error) }, pairedItem: { item: itemIndex } });
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
				}
			}
		}

		return returnData.length ? [returnData] : [];
	}
}


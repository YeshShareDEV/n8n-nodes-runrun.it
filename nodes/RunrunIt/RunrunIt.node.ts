import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, ApplicationError, NodeOperationError } from 'n8n-workflow';
import { administrationDescription } from './resources/Administration';
import { assistanceDescription } from './resources/Assistance';
import { AssetsDescription } from './resources/Assets';
import { componentsDescription } from './resources/Components';
import { dropdownsDescription } from './resources/Dropdowns';
import { managementDescription } from './resources/Management';
import { projectDescription } from './resources/Project';
import { ruleDescription } from './resources/Rule';
import { sessionDescription } from './resources/Session';

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
	'Assets': {
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
		autoupdatesystem: { id: 1, name: 'runrun.it Native Inventory' },
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
			throw new ApplicationError('Failed to login to runrun.it: session_token/access_token not found in response', {
				level: 'warning',
			});
		}

		return token;
	} catch (error) {
		if (error && typeof error === 'object' && 'response' in error) {
			const httpError = error as { response: { status: number; statusText: string } };
			throw new ApplicationError(
				`Failed to login to runrun.it: ${httpError.response.status} ${httpError.response.statusText}. Check your credentials and URL.`,
				{ level: 'error' },
			);
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new ApplicationError(`Failed to login to runrun.it: ${errorMessage}`, { level: 'error' });
	}
}

export class RunrunIt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'runrun.it Rest API V2 (Fork)',
		name: 'runrunItFork',
		icon: 'file:runrunit_v2.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'runrun.it REST API Node compatible with runrun.it.',
		defaults: {
			name: 'runrun.it Rest API V2',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		// eslint-disable-next-line @n8n/community-nodes/no-credential-reuse
		credentials: [{ name: 'runrunItApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Administration', value: 'Administration' },
					{ name: 'Components', value: 'Components' },
					{ name: 'Dropdowns', value: 'Dropdowns' },
					{ name: 'Management', value: 'Management' },
					{ name: 'Project', value: 'Project' },
					{ name: 'Rule', value: 'Rule' },
					{ name: 'Session', value: 'Session' },
					{ name: 'Assistance', value: 'Assistance' },
					{ name: 'Assets', value: 'Assets' },
				],
				default: 'Assets',
			},
			{
				displayName: 'Show Credentials Only',
				name: 'showCredentials',
				type: 'boolean',
				default: false,
				description: 'If enabled, the node will output the configured credentials and skip any API requests.',
			},

			// 'Limit' field removed from main node properties.
			...administrationDescription,
			...assistanceDescription,
			...AssetsDescription,
			...componentsDescription,
			...dropdownsDescription,
			...managementDescription,
			...projectDescription,
			...ruleDescription,
			...sessionDescription,
		],
	};

	methods: INodeType['methods'] = {
		loadOptions: {
			async getEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const self = this as ILoadOptionsFunctions;
					const creds = await self.getCredentials('runrunItApi');
				const baseUrl = buildBaseUrl(creds.host as string);
				const token = await getOAuthToken.call(
					self as unknown as IExecuteFunctions,
					baseUrl,
					creds.clientId as string,
					creds.clientSecret as string,
					creds.username as string,
					creds.password as string,
					(creds.scope as string) || undefined,
					(creds.useAuthorizationCode as boolean) ? (creds.authorizationCode as string) : undefined,
					(creds.redirectUri as string) || undefined,
				);

				const response = await (self.helpers as any).httpRequest({
					method: 'GET',
					url: `${baseUrl}/Administration/Entity`,
					headers: { Authorization: `Bearer ${token}` },
					json: true,
				});

				const list = Array.isArray(response) ? response : response?.data || [];
				return list.map((r: any) => ({ name: r.name || r.realname || r.label || `${r.id}`, value: r.id }));
			},
			async getProfiles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const self = this as ILoadOptionsFunctions;
				const creds = await self.getCredentials('runrunItApi');
				const baseUrl = buildBaseUrl(creds.host as string);
				const token = await getOAuthToken.call(
					self as unknown as IExecuteFunctions,
					baseUrl,
					creds.clientId as string,
					creds.clientSecret as string,
					creds.username as string,
					creds.password as string,
					(creds.scope as string) || undefined,
					(creds.useAuthorizationCode as boolean) ? (creds.authorizationCode as string) : undefined,
					(creds.redirectUri as string) || undefined,
				);

				const response = await (self.helpers as any).httpRequest({
					method: 'GET',
					url: `${baseUrl}/Administration/Profile`,
					headers: { Authorization: `Bearer ${token}` },
					json: true,
				});

				const list = Array.isArray(response) ? response : response?.data || [];
				return list.map((r: any) => ({ name: r.name || r.label || `${r.id}`, value: r.id }));
			},
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const self = this as ILoadOptionsFunctions;
				const creds = await self.getCredentials('runrunItApi');
				const baseUrl = buildBaseUrl(creds.host as string);
				const token = await getOAuthToken.call(
					self as unknown as IExecuteFunctions,
					baseUrl,
					creds.clientId as string,
					creds.clientSecret as string,
					creds.username as string,
					creds.password as string,
					(creds.scope as string) || undefined,
					(creds.useAuthorizationCode as boolean) ? (creds.authorizationCode as string) : undefined,
					(creds.redirectUri as string) || undefined,
				);

				const response = await (self.helpers as any).httpRequest({
					method: 'GET',
					url: `${baseUrl}/Administration/Group`,
					headers: { Authorization: `Bearer ${token}` },
					json: true,
				});

				const list = Array.isArray(response) ? response : response?.data || [];
				return list.map((r: any) => ({ name: r.name || r.realname || `${r.id}`, value: r.id }));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const creds = await this.getCredentials('runrunItApi');

		const baseUrl = buildBaseUrl(creds.host as string);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				// Determina o itemtype baseado no resource e operation
				let itemtype: string = (this.getNodeParameter('itemtype', itemIndex) as string) || '';

				// Support Assets, Administration, Assistance and Components: prefix itemtype with the resource when needed.
				if (
					itemtype &&
					(
						resource === 'Assets' ||
						resource === 'Administration' ||
						resource === 'Assistance' ||
						resource === 'Components' ||
						resource === 'Dropdowns'
					) &&
					!itemtype.includes('/')
				) {
					itemtype = `${resource}/${itemtype}`;
				}

				// Decide default for `sendRawBody` across resources (match Assets/Admin User behavior)
				const defaultSendRaw = (resource === 'Assets' || (resource === 'Administration' && itemtype.endsWith('/User')))
					? true
					: false;

				let options: IHttpRequestOptions | undefined;

				// Normaliza a operation para get/create/update
				let normalizedOperation = operation;
				if (operation === 'getGroup' || operation === 'getProfile') {
					normalizedOperation = 'get';
				} else if (operation === 'createGroup' || operation === 'createProfile') {
					normalizedOperation = 'create';
				} else if (operation === 'updateGroup' || operation === 'updateProfile') {
					normalizedOperation = 'update';
				}

				// Read pagination parameters when available in the node UI
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
						returnData.push({
							json: { error: err instanceof Error ? err.message : String(err) },
							pairedItem: { item: itemIndex },
						});
						continue;
					}
					throw err;
				}

				const headers: { [key: string]: string } = {
					Authorization: `Bearer ${token}`,
				};

				if (normalizedOperation === 'get') {
					const id = this.getNodeParameter('itemid', itemIndex, '') as string | number;

					if (itemtype && !itemtype.includes('/')) itemtype = `${resource}/${itemtype}`;

					// Build URL and apply resource-specific behavior
					let url = '';

					if (resource === 'Components') {
						// components: support Definitions and Instances endpoints
						const componentType = itemtype.includes('/') ? itemtype.split('/')[1] : itemtype;
						const endpoint = this.getNodeParameter('componentsEndpoint', itemIndex, 'definitions') as string;
						if (endpoint === 'instances') {
							url = `${baseUrl}/Components/${componentType}/Items${id ? '/' + id : ''}`;
							if (!id && returnAll === false) {
								const params: string[] = [];
								const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
								params.push(`limit=${limit}`);
								const definitionId = this.getNodeParameter('definitionId', itemIndex, 0) as number;
								if (definitionId) params.push(`definition_id=${definitionId}`);
								if (params.length) url += (url.includes('?') ? '&' : '?') + params.join('&');
							}
						} else {
							url = `${baseUrl}/Components/${componentType}${id ? '/' + id : ''}`;
							if (!id && returnAll === false) {
								const params: string[] = [];
								const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
								params.push(`limit=${limit}`);
								if (params.length) url += (url.includes('?') ? '&' : '?') + params.join('&');
							}
						}
					} else {
						// default behavior for other resources (including Assistance)
						url = `${baseUrl}/${itemtype}${id ? '/' + id : ''}`;
						if (!id && returnAll === false) {
							const params: string[] = [];
							const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
							params.push(`limit=${limit}`);
							// Support `filter` string for Assets, Assistance and Administration resources (defined in respective resources/*/get.ts)
							if (resource === 'Assets' || resource === 'Assistance' || resource === 'Administration') {
								const filtersParam = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
								const filterStr = (filtersParam && (filtersParam as any).filter) || '';
								if (filterStr) {
									params.push(`filter=${encodeURIComponent(filterStr)}`);
								}
							}
							if (params.length) {
								url += (url.includes('?') ? '&' : '?') + params.join('&');
							}
						}
					}

					// Assistance: append timeline params when requested
					if (resource === 'Assistance') {
						const includeTimeline = this.getNodeParameter('includeTimeline', itemIndex, false) as boolean;
						if (includeTimeline) {
							const timelineTypes = this.getNodeParameter('timelineTypes', itemIndex, []) as string[];
							const timelineParams: string[] = ['with_timeline=1'];
							if (Array.isArray(timelineTypes) && timelineTypes.length) {
								timelineParams.push(`timeline_types=${timelineTypes.join(',')}`);
							}
							url += (url.includes('?') ? '&' : '?') + timelineParams.join('&');
						}
					}

					options = {
						method: 'GET' as IHttpRequestMethods,
						url,
						headers,
						json: true,
					};
				} else if (normalizedOperation === 'create') {
					const input: IDataObject = {};

					if (resource === 'Administration') {
						if (itemtype.endsWith('/User')) {
							// For Administration/User creation the node now expects a raw JSON payload
							// in the `Input (raw)` field. Use `Send raw body` to control whether the
							// object is sent directly or wrapped as { input }.
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
							const sendRawBodyParam = this.getNodeParameter('sendRawBody', itemIndex, true) as boolean;
							if (isEmptyObject(rawInput)) {
								if (sendRawBodyParam && DEFAULT_RAW_TEMPLATES['Administration/User']) {
									rawInput = DEFAULT_RAW_TEMPLATES['Administration/User'];
								} else {
									if (this.continueOnFail()) {
										returnData.push({ json: { error: 'Input (raw) is required when creating Administration/User' }, pairedItem: { item: itemIndex } });
										continue;
									}
									throw new ApplicationError('Input (raw) is required when creating Administration/User', { level: 'error' });
								}
							}
							// Populate `input` with rawInput so the fallback POST uses it if needed
							Object.assign(input, rawInput);
						} else if (itemtype.endsWith('/Group')) {
							input.name = this.getNodeParameter('name', itemIndex) as string;
							input.is_requester = this.getNodeParameter('is_requester', itemIndex, true) ? 1 : 0;
							input.is_watcher = this.getNodeParameter('is_watcher', itemIndex, true) ? 1 : 0;
							input.is_notify = this.getNodeParameter('is_notify', itemIndex, true) ? 1 : 0;
							input.is_usergroup = this.getNodeParameter('is_usergroup', itemIndex, true) ? 1 : 0;

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.code) input.code = optionsParam.code;
							if (optionsParam.recursive_membership !== undefined) input.recursive_membership = optionsParam.recursive_membership ? 1 : 0;
							if (optionsParam.groups_id) input.groups_id = optionsParam.groups_id;
							if (optionsParam.comment) input.comment = optionsParam.comment;
							if (optionsParam.is_manager !== undefined) input.is_manager = optionsParam.is_manager ? 1 : 0;
							if (optionsParam.is_assign !== undefined) input.is_assign = optionsParam.is_assign ? 1 : 0;
							if (optionsParam.is_task !== undefined) input.is_task = optionsParam.is_task ? 1 : 0;
						} else {
							Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
						}
					} else if (resource === 'Assets') {
						// For Assets creation expect raw JSON in Input (raw). Use Send raw body to control wrapper.
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
						const sendRawBodyParamAssets = this.getNodeParameter('sendRawBody', itemIndex, true) as boolean;
						if (isEmptyObject(rawInput)) {
							if (sendRawBodyParamAssets && DEFAULT_RAW_TEMPLATES['Assets']) {
								rawInput = DEFAULT_RAW_TEMPLATES['Assets'];
							} else {
								if (this.continueOnFail()) {
									returnData.push({ json: { error: 'Input (raw) is required when creating Assets' }, pairedItem: { item: itemIndex } });
									continue;
								}
								throw new ApplicationError('Input (raw) is required when creating Assets', { level: 'error' });
							}
						}
						Object.assign(input, rawInput);
						}
					else if (resource === 'Assistance') {
						input.name = this.getNodeParameter('title', itemIndex) as string;
						input.content = this.getNodeParameter('description', itemIndex) as string;
						input.status = this.getNodeParameter('status', itemIndex, 0) as number;

						const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
						if (optionsParam.itilcategories_id) input.itilcategories_id = optionsParam.itilcategories_id;
						if (optionsParam.users_id_observer) input._users_id_observer = optionsParam.users_id_observer;

						const requester = this.getNodeParameter('users_id_requester', itemIndex, '') as string;
						if (requester) input._users_id_requester = requester;

						const assign = this.getNodeParameter('users_id_assign', itemIndex, 0) as number;
						if (assign) input._users_id_assign = assign;
					} else if (resource === 'Components') {
						// Components: decide whether to create a definition or an instance
						const componentType = itemtype.includes('/') ? itemtype.split('/')[1] : itemtype;
						const createInstance = this.getNodeParameter('createInstance', itemIndex, false) as boolean;
						if (createInstance) {
							// create instance under definitionId
							const definitionId = this.getNodeParameter('definitionId', itemIndex, 0) as number;
							if (!definitionId) {
								if (this.continueOnFail()) {
									returnData.push({ json: { error: 'definitionId is required when creating an instance' }, pairedItem: { item: itemIndex } });
									continue;
								}
								throw new ApplicationError('definitionId is required when creating an instance', { level: 'error' });
							}
							// ensure basic title/description
							input.name = this.getNodeParameter('title', itemIndex, '') as string;
							if (!input.name) input.name = `Instance of ${componentType}`;
							options = {
								method: 'POST' as IHttpRequestMethods,
								url: `${baseUrl}/Components/${componentType}/Items`,
								headers,
								body: { input },
								json: true,
							};
						} else {
							// create definition
							input.name = this.getNodeParameter('title', itemIndex) as string;
							options = {
								method: 'POST' as IHttpRequestMethods,
								url: `${baseUrl}/Components/${componentType}`,
								headers,
								body: { input },
								json: true,
							};
						}
						// options already set above for Components
				
					} else {
						Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
					}

					// If options were not set by a resource-specific handler (e.g. Components), use default POST to itemtype
						if (!options) {
							// If user provided a raw JSON in the `input` field and requested to send it as-is,
							// use that object as the request body (no { input } wrapper). Otherwise wrap as { input }.
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
							const sendRawBody = this.getNodeParameter('sendRawBody', itemIndex, defaultSendRaw) as boolean;
							if (sendRawBody && isEmptyObject(rawInput)) {
								// Try to use a sensible default template for known resources
								if (resource === 'Administration' && itemtype.endsWith('/User')) {
									rawInput = DEFAULT_RAW_TEMPLATES['Administration/User'];
								} else if (resource === 'Assets') {
									rawInput = DEFAULT_RAW_TEMPLATES['Assets'];
								}
							}
							const bodyToSend = sendRawBody && !isEmptyObject(rawInput) ? rawInput : { input };

							options = {
								method: 'POST' as IHttpRequestMethods,
								url: `${baseUrl}/${itemtype}`,
								headers,
								body: bodyToSend,
								json: true,
							};
						}

				} else if (normalizedOperation === 'update') {
					const id = this.getNodeParameter('itemid', itemIndex);

					// Validate that an item id was provided for update operations
					const idValueUpd: any = id;
					const idNumUpd = typeof idValueUpd === 'string' ? (idValueUpd === '' ? NaN : Number(idValueUpd)) : Number(idValueUpd);
					if (!idValueUpd || Number.isNaN(idNumUpd) || idNumUpd === 0) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: 'Item ID (itemid) is required and must be a positive number for update operations' }, pairedItem: { item: itemIndex } });
							continue;
						}
						throw new ApplicationError('Item ID (itemid) is required and must be a positive number for update operations', { level: 'error' });
					}
					const input: IDataObject = {};

					if (resource === 'Administration') {
						if (itemtype.endsWith('/Group')) {
							const name = this.getNodeParameter('name', itemIndex, '') as string;
							if (name) input.name = name;

							const isRequester = this.getNodeParameter('is_requester', itemIndex, undefined) as boolean | undefined;
							if (isRequester !== undefined) input.is_requester = isRequester ? 1 : 0;

							const isWatcher = this.getNodeParameter('is_watcher', itemIndex, undefined) as boolean | undefined;
							if (isWatcher !== undefined) input.is_watcher = isWatcher ? 1 : 0;

							const isNotify = this.getNodeParameter('is_notify', itemIndex, undefined) as boolean | undefined;
							if (isNotify !== undefined) input.is_notify = isNotify ? 1 : 0;

							const isUsergroup = this.getNodeParameter('is_usergroup', itemIndex, undefined) as boolean | undefined;
							if (isUsergroup !== undefined) input.is_usergroup = isUsergroup ? 1 : 0;

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.code) input.code = optionsParam.code;
							if (optionsParam.recursive_membership !== undefined) input.recursive_membership = optionsParam.recursive_membership ? 1 : 0;
							if (optionsParam.groups_id) input.groups_id = optionsParam.groups_id;
							if (optionsParam.comment) input.comment = optionsParam.comment;
							if (optionsParam.is_manager !== undefined) input.is_manager = optionsParam.is_manager ? 1 : 0;
							if (optionsParam.is_assign !== undefined) input.is_assign = optionsParam.is_assign ? 1 : 0;
							if (optionsParam.is_task !== undefined) input.is_task = optionsParam.is_task ? 1 : 0;
						} else {
							// Follow Assets model: do not enforce raw JSON here for `Administration/User`.
							// Let the generic final block decide whether to send the raw body or the
							// `{ input }` wrapper (and whether to use the default template when
							// `sendRawBody` is enabled and input is empty).
							Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
						}
					} else if (resource === 'Assistance') {
						const title = this.getNodeParameter('title', itemIndex, '') as string;
						if (title) input.name = title;

						const description = this.getNodeParameter('description', itemIndex, '') as string;
						if (description) input.content = description;

						const status = this.getNodeParameter('status', itemIndex, 0) as number;
						if (status) input.status = status;

						const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
						if (optionsParam.itilcategories_id) input.itilcategories_id = optionsParam.itilcategories_id;
						if (optionsParam.users_id_observer) input._users_id_observer = optionsParam.users_id_observer;

						const requester = this.getNodeParameter('users_id_requester', itemIndex, '') as string;
						if (requester) input._users_id_requester = requester;

						const assign = this.getNodeParameter('users_id_assign', itemIndex, 0) as number;
						if (assign) input._users_id_assign = assign;
					} else {
						Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
					}

					if (resource === 'Components') {
						const componentType = itemtype.includes('/') ? itemtype.split('/')[1] : itemtype;
						const endpoint = this.getNodeParameter('componentsEndpoint', itemIndex, 'definitions') as string;
						const url = endpoint === 'instances' ? `${baseUrl}/Components/${componentType}/Items/${id}` : `${baseUrl}/Components/${componentType}/${id}`;
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
						const sendRawBody = this.getNodeParameter('sendRawBody', itemIndex, defaultSendRaw) as boolean;
						if (sendRawBody && isEmptyObject(rawInput)) {
							// No default templates for Components; leave rawInput empty so
							// the generic wrapper { input } is used instead.
						}
						const bodyToSend = sendRawBody && !isEmptyObject(rawInput) ? rawInput : { input };
						options = {
							method: 'PUT' as IHttpRequestMethods,
							url,
							headers,
							body: bodyToSend,
							json: true,
						};
					} else {
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
						const sendRawBody = this.getNodeParameter('sendRawBody', itemIndex, false) as boolean;
						if (sendRawBody && isEmptyObject(rawInput)) {
							if (resource === 'Administration' && itemtype.endsWith('/User')) {
								rawInput = DEFAULT_RAW_TEMPLATES['Administration/User'];
							} else if (resource === 'Assets') {
								rawInput = DEFAULT_RAW_TEMPLATES['Assets'];
							}
						}
						const bodyToSend = sendRawBody && !isEmptyObject(rawInput) ? rawInput : { input };
						options = {
							method: (resource === 'Assets' || resource === 'Administration' ? 'PATCH' : 'PUT') as IHttpRequestMethods,
							url: `${baseUrl}/${itemtype}/${id}`,
							headers,
							body: bodyToSend,
							json: true,
						};
					}
				} else if (operation === 'delete') {
					const id = this.getNodeParameter('itemid', itemIndex);

					// Validate that an item id was provided for delete operations
					const idValueDel: any = id;
					const idNumDel = typeof idValueDel === 'string' ? (idValueDel === '' ? NaN : Number(idValueDel)) : Number(idValueDel);
					if (!idValueDel || Number.isNaN(idNumDel) || idNumDel === 0) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: 'Item ID (itemid) is required and must be a positive number for delete operations' }, pairedItem: { item: itemIndex } });
							continue;
						}
						throw new ApplicationError('Item ID (itemid) is required and must be a positive number for delete operations', { level: 'error' });
					}
					if (resource === 'Components') {
						const componentType = itemtype.includes('/') ? itemtype.split('/')[1] : itemtype;
						const endpoint = this.getNodeParameter('componentsEndpoint', itemIndex, 'definitions') as string;
						const url = endpoint === 'instances' ? `${baseUrl}/Components/${componentType}/Items/${id}` : `${baseUrl}/Components/${componentType}/${id}`;
						options = {
							method: 'DELETE' as IHttpRequestMethods,
							url,
							headers,
							json: true,
						};
					} else {
						if (itemtype && !itemtype.includes('/')) itemtype = `${resource}/${itemtype}`;
						options = {
							method: 'DELETE' as IHttpRequestMethods,
							url: `${baseUrl}/${itemtype}/${id}`,
							headers,
							json: true,
						};
					}
				} else {
					throw new ApplicationError(`Unknown operation: ${operation}`, { level: 'warning' });
				}

				const showCredentials = this.getNodeParameter('showCredentials', itemIndex, false) as boolean;

				// ensure Content-Type only when body is present
				if (options && (options as IHttpRequestOptions).body !== undefined) {
					options.headers = {
						...(options.headers || {}),
						'Content-Type': 'application/json',
					};
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
					// Execute the prepared request and return the response
						const response = await this.helpers.httpRequest(options as any);
						// If the API returned an array, push each element as a separate output row
						if (Array.isArray(response)) {
							let outputArray = response;

							// No local sort applied (sorting removed)

							if (returnAll === false) {
								const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
								// start is intentionally not used when server-side pagination is applied
								outputArray = outputArray.slice(0, limit);
							}

							for (const resItem of outputArray) {
								returnData.push({
									json: resItem,
									pairedItem: { item: itemIndex },
								});
							}
						} else {
							returnData.push({
								json: response,
								pairedItem: { item: itemIndex },
							});
						}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: itemIndex },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
				}
			}
		}

		return returnData.length ? [returnData] : [];
	}
}


import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClients = {
  resource: ['clients'],
};

export const clientsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForClients },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get clients',
        description: 'List clients',
        routing: { request: { method: 'GET', url: '/clients' } },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a client',
        description: 'Get a client by id',
        routing: { request: { method: 'GET', url: '=/clients/{{$parameter.clientId}}' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a client',
        description: 'Create a new client',
        routing: { request: { method: 'POST', url: '/clients' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a client',
        description: 'Update client fields',
        routing: { request: { method: 'PUT', url: '=/clients/{{$parameter.clientId}}' } },
      },
      {
        name: 'List Monthly Budgets',
        value: 'monthly_budgets',
        action: 'List monthly budgets',
        description: 'List monthly budgets for a client',
        routing: { request: { method: 'GET', url: '=/clients/{{$parameter.clientId}}/monthly_budgets' } },
      },
      {
        name: 'Update Monthly Budget',
        value: 'update_monthly_budget',
        action: 'Update monthly budget',
        description: 'Create/update monthly budget for a client',
        routing: { request: { method: 'POST', url: '=/clients/{{$parameter.clientId}}/update_monthly_budget' } },
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    displayOptions: { show: { resource: ['clients'], operation: ['get', 'update', 'monthly_budgets', 'update_monthly_budget'] } },
    default: '',
    description: 'ID of the client',
  },
  {
    displayName: 'Client Object (JSON)',
    name: 'clientObject',
    type: 'json',
    displayOptions: { show: { resource: ['clients'], operation: ['create', 'update'] } },
    default: '{}',
    description: 'Client payload, e.g. {"client": {"name":"ACME"}}',
    routing: {
      send: {
        type: 'body',
        property: 'client',
      },
    },
  },
  {
    displayName: 'Monthly Budget Object (JSON)',
    name: 'budgetObject',
    type: 'json',
    displayOptions: { show: { resource: ['clients'], operation: ['update_monthly_budget'] } },
    default: '{"monthly_budget": {"month": "2026-03", "hours": 100, "cost": 2000}}',
    description: 'Monthly budget payload',
    routing: {
      send: {
        type: 'body',
        property: 'monthly_budget',
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { resource: ['clients'], operation: ['getAll'], returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { resource: ['clients'], operation: ['getAll'], returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['clients'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: { send: { paginate: '={{ $value }}' }, operations: { pagination: { type: 'offset', properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' } } } },
  },
];

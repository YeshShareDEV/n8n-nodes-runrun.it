import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClients = {
  resource: ['clients'],
};

const showOnlyForClientWithId = {
  resource: ['clients'],
  operation: ['get', 'update', 'monthly_budgets'],
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
];

import type { INodeProperties } from 'n8n-workflow';
import { clientsGetAllDescription } from './getAll';
import { clientsGetDescription } from './get';
import { clientsCreateDescription } from './create';
import { clientsUpdateDescription } from './update';
import { clientsMonthlyBudgetsDescription } from './monthlyBudgets';

export const clientsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['clients'] } },
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
  ...clientsGetAllDescription,
  ...clientsGetDescription,
  ...clientsCreateDescription,
  ...clientsUpdateDescription,
  ...clientsMonthlyBudgetsDescription,
];

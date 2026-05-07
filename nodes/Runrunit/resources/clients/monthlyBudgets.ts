import type { INodeProperties } from 'n8n-workflow';

const showBudgetOps = { resource: ['clients'], operation: ['monthly_budgets', 'update_monthly_budget'] };

export const clientsMonthlyBudgetsDescription: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    displayOptions: { show: showBudgetOps },
    default: '',
    description: 'ID of the client',
  },
  {
    displayName: 'Monthly Budget Object (JSON)',
    name: 'budgetObject',
    type: 'json',
    displayOptions: { show: { resource: ['clients'], operation: ['update_monthly_budget'] } },
    default: '{"month":"2026-03","hours":100,"cost":2000}',
    description: 'Monthly budget payload sent as `monthly_budget` in the body',
    routing: { send: { type: 'body', property: 'monthly_budget' } },
  },
];

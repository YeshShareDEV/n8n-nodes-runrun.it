import type { INodeProperties } from 'n8n-workflow';

const showGetBudgets = { resource: ['clients'], operation: ['monthly_budgets'] };
const showBudgetOps = { resource: ['clients'], operation: ['monthly_budgets', 'update_monthly_budget'] };

export const clientsMonthlyBudgetsDescription: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    displayOptions: { show: showBudgetOps },
    default: '',
    required: true,
    description: 'ID of the client',
  },
  {
    displayName: 'Month',
    name: 'month',
    type: 'string',
    displayOptions: { show: showGetBudgets },
    default: '',
    placeholder: '2026-03',
    description: 'Filter by year-month (format: YYYY-MM)',
    routing: { send: { type: 'query', property: 'month' } },
  },
  {
    displayName: 'Time',
    name: 'time',
    type: 'number',
    displayOptions: { show: showGetBudgets },
    default: 0,
    description: 'Include others (time filter)',
    routing: { send: { type: 'query', property: 'time' } },
  },
  {
    displayName: 'Cost',
    name: 'cost',
    type: 'string',
    displayOptions: { show: showGetBudgets },
    default: '',
    description: 'Cost filter',
    routing: { send: { type: 'query', property: 'cost' } },
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

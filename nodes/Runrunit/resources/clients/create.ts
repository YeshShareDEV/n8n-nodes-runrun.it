import type { INodeProperties } from 'n8n-workflow';

const show = { resource: ['clients'], operation: ['create'] };

export const clientsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'clientName',
    type: 'string',
    displayOptions: { show },
    default: '',
    required: true,
    description: "Client's name",
  },
  {
    displayName: 'Is Visible',
    name: 'clientIsVisible',
    type: 'boolean',
    displayOptions: { show },
    default: true,
    description: 'Whether the client is currently visible to be used',
  },
  {
    displayName: 'Budgeted Hours/Month',
    name: 'clientBudgetedHoursMonth',
    type: 'number',
    displayOptions: { show },
    default: 0,
    description: 'Budgeted hours per month',
  },
  {
    displayName: 'Budgeted Cost/Month',
    name: 'clientBudgetedCostMonth',
    type: 'number',
    displayOptions: { show },
    default: 0,
    description: 'Budgeted cost per month',
  },
  {
    displayName: 'Custom Field',
    name: 'clientCustomField',
    type: 'string',
    displayOptions: { show },
    default: '',
    description: 'Custom field value',
  },
];

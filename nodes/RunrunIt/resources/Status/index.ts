import type { INodeProperties } from 'n8n-workflow';
import { statusGetDescription } from './get';
import { statusOptionsDescription } from './options';

const showOnlyForStatus = { resource: ['Status'] };

export const statusDescription: INodeProperties[] = [
  {
    displayName: 'Action',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForStatus },
    options: [
      { name: 'List Services', value: 'listServices', action: 'GET /status' },
      { name: 'Get Service', value: 'getService', action: 'GET /status/{service}' },
      { name: 'Get All', value: 'getAll', action: 'GET /status/all' },
    ],
    default: 'listServices',
  },
  {
    displayName: 'Service',
    name: 'service',
    type: 'string',
    default: '',
    description: 'Service identifier to query (required for Get Service)',
    displayOptions: { show: { resource: ['Status'], operation: ['getService'] } },
  },
  {
    displayName: 'Return Raw JSON',
    name: 'rawOutput',
    type: 'boolean',
    default: false,
    displayOptions: { show: showOnlyForStatus },
    description: 'Return the raw JSON response for diagnostics',
  },
  {
    displayName: 'Show Timestamps',
    name: 'showTimestamps',
    type: 'boolean',
    default: true,
    displayOptions: { show: showOnlyForStatus },
    description: 'Include timestamps in the formatted output',
  },
  {
    displayName: 'Show Status Icons',
    name: 'showIcons',
    type: 'boolean',
    default: true,
    displayOptions: { show: showOnlyForStatus },
    description: 'Show ok/warning/error icons in the UI',
  },
  {
    displayName: 'Expand Details By Default',
    name: 'expandDetails',
    type: 'boolean',
    default: false,
    displayOptions: { show: showOnlyForStatus },
    description: 'When true, expand service detail sections by default',
  },
  ...statusGetDescription,
  ...statusOptionsDescription,
];

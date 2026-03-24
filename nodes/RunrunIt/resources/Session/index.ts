import type { INodeProperties } from 'n8n-workflow';
import { sessionGetDescription } from './get';
import { sessionOptionsDescription } from './options';

const showOnlyForSession = { resource: ['Session'] };

export const sessionDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForSession },
    options: [
      { name: 'Get Session', value: 'get', action: 'GET /session' },
    ],
    default: 'get',
  },
  {
    displayName: 'Show Raw JSON',
    name: 'rawOutput',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['Session'], operation: ['get'] } },
    description: 'Return the raw JSON response instead of the parsed key/value view',
  },
  {
    displayName: 'Show Simplified View',
    name: 'simplifiedView',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['Session'], operation: ['get'] } },
    description: 'Show session fields in a simplified card layout',
  },
  {
    displayName: 'Reauthentication Link',
    name: 'reauthLink',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['Session'], operation: ['get'] } },
    description: 'Optional help/reauthentication URL to surface on 401/403',
  },
  ...sessionGetDescription,
  ...sessionOptionsDescription,
];

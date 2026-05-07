import type { INodeProperties } from 'n8n-workflow';

export const clientsUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    displayOptions: { show: { resource: ['clients'], operation: ['update'] } },
    default: '',
    description: 'ID of the client',
  },
  {
    displayName: 'Client Object (JSON)',
    name: 'clientObject',
    type: 'json',
    displayOptions: { show: { resource: ['clients'], operation: ['update'] } },
    default: '{}',
    description: 'Client payload sent as `client` in the body',
    routing: { send: { type: 'body', property: 'client' } },
  },
];

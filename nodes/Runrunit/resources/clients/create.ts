import type { INodeProperties } from 'n8n-workflow';

export const clientsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Client Object (JSON)',
    name: 'clientObject',
    type: 'json',
    displayOptions: { show: { resource: ['clients'], operation: ['create'] } },
    default: '{}',
    description: 'Client payload sent as `client` in the body',
    routing: { send: { type: 'body', property: 'client' } },
  },
];

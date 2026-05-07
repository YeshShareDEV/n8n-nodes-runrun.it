import type { INodeProperties } from 'n8n-workflow';

export const clientsGetDescription: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    displayOptions: { show: { resource: ['clients'], operation: ['get'] } },
    default: '',
    description: 'ID of the client',
  },
];

import type { INodeProperties } from 'n8n-workflow';

export const teamCreateDescription: INodeProperties[] = [
  {
    displayName: 'Team Object (JSON)',
    name: 'teamObject',
    type: 'json',
    displayOptions: { show: { resource: ['team'], operation: ['create'] } },
    default: '{}',
    description: 'Team payload sent as `team` in the body',
    routing: { send: { type: 'body', property: 'team' } },
  },
];

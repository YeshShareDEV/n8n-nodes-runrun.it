import type { INodeProperties } from 'n8n-workflow';

export const teamUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    displayOptions: { show: { resource: ['team'], operation: ['update'] } },
    default: '',
    required: true,
    description: 'ID of the team',
  },
  {
    displayName: 'Team Object (JSON)',
    name: 'teamObject',
    type: 'json',
    displayOptions: { show: { resource: ['team'], operation: ['update'] } },
    default: '{}',
    description: 'Team payload sent as `team` in the body',
    routing: { send: { type: 'body', property: 'team' } },
  },
];

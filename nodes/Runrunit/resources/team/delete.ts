import type { INodeProperties } from 'n8n-workflow';

export const teamDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    displayOptions: { show: { resource: ['team'], operation: ['delete'] } },
    default: '',
    required: true,
    description: 'ID of the team',
  },
];

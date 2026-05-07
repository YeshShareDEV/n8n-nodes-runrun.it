import type { INodeProperties } from 'n8n-workflow';

export const teamGetDescription: INodeProperties[] = [
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    displayOptions: { show: { resource: ['team'], operation: ['get'] } },
    default: '',
    required: true,
    description: 'ID of the team',
  },
];

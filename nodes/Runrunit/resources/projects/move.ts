import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMove = {
  resource: ['projects'],
  operation: ['move'],
};

export const projectMoveDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForMove },
    default: '',
    required: true,
    description: 'ID of the project to move',
  },
  {
    displayName: 'Move Object (JSON)',
    name: 'moveObject',
    type: 'json',
    displayOptions: { show: showOnlyForMove },
    default: '{}',
    description: 'Payload, e.g. {"client_id":2} or {"project_group_id":4}',
  },
];

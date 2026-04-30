import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjectsWithId = {
  resource: ['projects'],
  operation: ['update'],
};

export const projectUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForProjectsWithId },
    default: '',
    required: true,
    description: 'ID of the project to update',
  },
  {
    displayName: 'Project Object (JSON)',
    name: 'projectObject',
    type: 'json',
    displayOptions: { show: showOnlyForProjectsWithId },
    default: '{}',
    description: 'Partial project object to send as body',
    routing: {
      send: {
        type: 'body',
      },
    },
  },
];

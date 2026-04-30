import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjectWithId = {
  resource: ['projects'],
  operation: ['get'],
};

export const projectGetDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForProjectWithId },
    default: '',
    required: true,
    description: 'ID of the project',
  },
];

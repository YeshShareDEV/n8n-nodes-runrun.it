import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjectsWithId = {
  resource: ['projects'],
  operation: ['related_users'],
};

export const projectRelatedUsersDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForProjectsWithId },
    default: '',
    required: true,
    description: 'ID of the project',
  },
];

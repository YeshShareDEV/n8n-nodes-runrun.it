import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUnshare = {
  resource: ['projects'],
  operation: ['unshare'],
};

export const projectUnshareDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForUnshare },
    default: '',
    required: true,
    description: 'ID of the project to unshare',
  },
];

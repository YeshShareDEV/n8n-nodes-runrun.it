import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClone = {
  resource: ['projects'],
  operation: ['clone'],
};

export const projectCloneDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForClone },
    default: '',
    required: true,
    description: 'ID of the project to clone',
  },
  {
    displayName: 'Clone Object (JSON)',
    name: 'cloneObject',
    type: 'json',
    displayOptions: { show: showOnlyForClone },
    default: '{}',
    description: 'Payload, e.g. {"new_project":{"name":"Cloned Project"}}',
  },
];

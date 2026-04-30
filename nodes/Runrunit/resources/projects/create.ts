import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjects = {
  resource: ['projects'],
  operation: ['create'],
};

export const projectCreateDescription: INodeProperties[] = [
  {
    displayName: 'Project Object (JSON)',
    name: 'projectObject',
    type: 'json',
    displayOptions: { show: showOnlyForProjects },
    default: '{}',
    description: 'Project payload, e.g. {"project": {"name":"New Project"}}',
    routing: {
      send: {
        type: 'body',
        property: 'project',
      },
    },
  },
];

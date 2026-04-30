import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjects = {
  resource: ['projects'],
  operation: ['getAll'],
};

export const projectsGetManyDescription: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['projects'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { ...showOnlyForProjects, returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { ...showOnlyForProjects, returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination',
  },
];

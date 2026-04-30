import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjects = {
  resource: ['projects'],
};

export const projectsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForProjects },
    options: [
      {
        name: 'List Filters',
        value: 'getAll_filters',
        action: 'List project filters',
        description: 'List all project filters the current user can view',
        routing: { request: { method: 'GET', url: '/projects/filters' } },
      },
      {
        name: 'Get Filter',
        value: 'get_filter',
        action: 'Get a project filter',
        description: 'Get a single project filter by id',
        routing: { request: { method: 'GET', url: '=/projects/filters/{{$parameter.filterId}}' } },
      },
      {
        name: 'Delete Filter',
        value: 'delete_filter',
        action: 'Delete a project filter',
        description: 'Delete a filter record',
        routing: { request: { method: 'DELETE', url: '=/projects/filters/{{$parameter.filterId}}' } },
      },
    ],
    default: 'getAll_filters',
  },
  {
    displayName: 'Filter ID',
    name: 'filterId',
    type: 'string',
    displayOptions: { show: { resource: ['projects'], operation: ['get_filter', 'delete_filter'] } },
    default: '',
    description: 'ID of the project filter',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { resource: ['projects'], operation: ['getAll_filters'], returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { resource: ['projects'], operation: ['getAll_filters'], returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['projects'], operation: ['getAll_filters'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: { send: { paginate: '={{ $value }}' }, operations: { pagination: { type: 'offset', properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' } } } },
  },
];

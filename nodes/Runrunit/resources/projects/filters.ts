import type { INodeProperties } from 'n8n-workflow';

export const projectsFiltersDescription: INodeProperties[] = [
  {
    displayName: 'List Filters',
    name: 'listFilters',
    type: 'notice',
    displayOptions: { show: { resource: ['projects'], operation: ['getAll_filters'] } },
    default: '',
    description: 'Use this operation to list project filters (GET /projects/filters)',
  },
  {
    displayName: 'Filter ID',
    name: 'filterId',
    type: 'string',
    displayOptions: { show: { resource: ['projects'], operation: ['get_filter', 'delete_filter'] } },
    default: '',
    description: 'ID of the project filter',
  },
];

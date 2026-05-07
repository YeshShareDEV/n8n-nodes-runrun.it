import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItemsGetAll = {
  resource: ['checklistItems'],
  operation: ['getAll'],
};

export const checklistItemsGetAllDescription: INodeProperties[] = [
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsGetAll },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: showOnlyForChecklistItemsGetAll },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: {
      send: { paginate: '={{ $value }}' },
      operations: {
        pagination: {
          type: 'offset',
          properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' },
        },
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { ...showOnlyForChecklistItemsGetAll, returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { ...showOnlyForChecklistItemsGetAll, returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
];

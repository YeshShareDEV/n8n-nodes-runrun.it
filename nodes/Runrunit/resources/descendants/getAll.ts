import type { INodeProperties } from 'n8n-workflow';

const show = { resource: ['descendants'], operation: ['getAll'] };

export const descendantsGetAllDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show },
    default: '',
    required: true,
    description: 'ID of the parent task',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
  {
    displayName: 'Sort',
    name: 'sort',
    type: 'string',
    displayOptions: { show },
    default: '',
    description: 'Field name to sort results by',
    routing: { send: { type: 'query', property: 'sort' } },
  },
  {
    displayName: 'Sort Direction',
    name: 'sort_dir',
    type: 'options',
    displayOptions: { show, hide: { sort: [''] } },
    options: [
      { name: 'Ascending', value: 'asc' },
      { name: 'Descending', value: 'desc' },
    ],
    default: 'asc',
    description: 'Direction to sort the results',
    routing: { send: { type: 'query', property: 'sort_dir' } },
  },
];

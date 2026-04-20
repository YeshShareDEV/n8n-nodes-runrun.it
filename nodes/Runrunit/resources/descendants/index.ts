import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDescendants = {
  resource: ['descendants'],
};

export const descendantsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForDescendants },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'List descendants',
        description: 'List all descendants/subtasks of a task',
        routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/descendants' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create descendant',
        description: 'Add a descendant/subtask to a task',
        routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/descendants' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete descendant',
        description: 'Remove a descendant task',
        routing: { request: { method: 'DELETE', url: '=/tasks/{{$parameter.taskId}}/descendants/{{$parameter.descendantId}}' } },
      },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['descendants'], operation: ['getAll', 'create', 'delete'] } },
    default: '',
    required: true,
    description: 'ID of the parent task',
  },
  {
    displayName: 'Descendant ID',
    name: 'descendantId',
    type: 'string',
    displayOptions: { show: { resource: ['descendants'], operation: ['delete'] } },
    default: '',
    required: true,
    description: 'ID of the descendant to remove',
  },
  {
    displayName: 'Descendant Object (JSON)',
    name: 'descendantObject',
    type: 'json',
    displayOptions: { show: { resource: ['descendants'], operation: ['create'] } },
    default: '{"title":""}',
    description: 'Descendant/task payload (sent as `task`), e.g. {"task": {"title": "Subtask title"}}',
    routing: {
      send: {
        type: 'body',
        property: 'task',
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { resource: ['descendants'], operation: ['getAll'], returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { resource: ['descendants'], operation: ['getAll'], returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['descendants'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: { send: { paginate: '={{ $value }}' }, operations: { pagination: { type: 'offset', properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' } } } },
  },
];

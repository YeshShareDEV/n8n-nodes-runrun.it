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
];

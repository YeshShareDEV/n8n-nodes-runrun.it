import type { INodeProperties } from 'n8n-workflow';
import { descendantsGetAllDescription } from './getAll';
import { descendantsCreateDescription } from './create';
import { descendantsDeleteDescription } from './delete';

export const descendantsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['descendants'] } },
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
  ...descendantsGetAllDescription,
  ...descendantsCreateDescription,
  ...descendantsDeleteDescription,
];

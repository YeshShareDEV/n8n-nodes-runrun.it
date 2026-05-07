import type { INodeProperties } from 'n8n-workflow';

export const descendantsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['descendants'], operation: ['create'] } },
    default: '',
    required: true,
    description: 'ID of the parent task',
  },
  {
    displayName: 'Descendant Object (JSON)',
    name: 'descendantObject',
    type: 'json',
    displayOptions: { show: { resource: ['descendants'], operation: ['create'] } },
    default: '{"title":""}',
    description: 'Descendant/task payload sent as `task` in the body',
    routing: { send: { type: 'body', property: 'task' } },
  },
];

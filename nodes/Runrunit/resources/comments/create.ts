import type { INodeProperties } from 'n8n-workflow';

export const commentsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['create'] } },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Comment Object (JSON)',
    name: 'commentObject',
    type: 'json',
    displayOptions: { show: { resource: ['comments'], operation: ['create'] } },
    default: '{"body":""}',
    description: 'Comment payload sent as `comment` in the body',
    routing: { send: { type: 'body', property: 'comment' } },
  },
];

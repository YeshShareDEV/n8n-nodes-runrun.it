import type { INodeProperties } from 'n8n-workflow';

export const commentsUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['update'] } },
    default: '',
    required: true,
    description: 'ID of the comment',
  },
  {
    displayName: 'Comment Object (JSON)',
    name: 'commentObject',
    type: 'json',
    displayOptions: { show: { resource: ['comments'], operation: ['update'] } },
    default: '{"body":""}',
    description: 'Comment payload sent as `comment` in the body',
    routing: { send: { type: 'body', property: 'comment' } },
  },
];

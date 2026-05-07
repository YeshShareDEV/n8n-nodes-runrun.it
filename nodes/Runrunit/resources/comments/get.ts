import type { INodeProperties } from 'n8n-workflow';

export const commentsGetDescription: INodeProperties[] = [
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['get'] } },
    default: '',
    required: true,
    description: 'ID of the comment',
  },
];

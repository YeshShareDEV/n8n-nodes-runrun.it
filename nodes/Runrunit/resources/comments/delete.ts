import type { INodeProperties } from 'n8n-workflow';

export const commentsDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['delete'] } },
    default: '',
    required: true,
    description: 'ID of the comment',
  },
];

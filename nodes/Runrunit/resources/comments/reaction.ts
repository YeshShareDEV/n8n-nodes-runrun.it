import type { INodeProperties } from 'n8n-workflow';

export const commentsReactionDescription: INodeProperties[] = [
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['reaction'] } },
    default: '',
    required: true,
    description: 'ID of the comment',
  },
  {
    displayName: 'Reaction Object (JSON)',
    name: 'reactionObject',
    type: 'json',
    displayOptions: { show: { resource: ['comments'], operation: ['reaction'] } },
    default: '{"kind":"like"}',
    description: 'Reaction payload sent as `reaction` in the body',
    routing: { send: { type: 'body', property: 'reaction' } },
  },
];

import type { INodeProperties } from 'n8n-workflow';
import { commentsGetAllDescription } from './getAll';
import { commentsGetDescription } from './get';
import { commentsCreateDescription } from './create';
import { commentsUpdateDescription } from './update';
import { commentsDeleteDescription } from './delete';
import { commentsReactionDescription } from './reaction';

export const commentsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['comments'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get comments',
        description: 'List comments for a task',
        routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/comments' } },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a comment',
        description: 'Get a single comment by id',
        routing: { request: { method: 'GET', url: '=/comments/{{$parameter.commentId}}' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a comment',
        description: 'Create a new comment (task or project)',
        routing: { request: { method: 'POST', url: '/comments' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a comment',
        description: 'Update a comment body',
        routing: { request: { method: 'PUT', url: '=/comments/{{$parameter.commentId}}' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a comment',
        description: 'Delete a comment',
        routing: { request: { method: 'DELETE', url: '=/comments/{{$parameter.commentId}}' } },
      },
      {
        name: 'Reaction',
        value: 'reaction',
        action: 'React to a comment',
        description: 'Add or update a reaction to a comment',
        routing: { request: { method: 'POST', url: '=/comments/{{$parameter.commentId}}/reaction' } },
      },
    ],
    default: 'getAll',
  },
  ...commentsGetAllDescription,
  ...commentsGetDescription,
  ...commentsCreateDescription,
  ...commentsUpdateDescription,
  ...commentsDeleteDescription,
  ...commentsReactionDescription,
];

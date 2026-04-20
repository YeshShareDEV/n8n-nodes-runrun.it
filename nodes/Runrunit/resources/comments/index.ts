import type { INodeProperties } from 'n8n-workflow';

const showOnlyForComments = {
  resource: ['comments'],
};

const showOnlyForCommentWithId = {
  resource: ['comments'],
  operation: ['get', 'update', 'delete', 'reaction'],
};

export const commentsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForComments },
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
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['comments'], operation: ['getAll', 'create'] } },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    displayOptions: { show: showOnlyForCommentWithId },
    default: '',
    required: true,
    description: 'ID of the comment',
  },
  {
    displayName: 'Comment Object (JSON)',
    name: 'commentObject',
    type: 'json',
    displayOptions: { show: { resource: ['comments'], operation: ['create', 'update'] } },
    default: '{"body":""}',
    description: 'Comment payload. For create use {"comment": { "body": "text", "task_id": 123 }}',
    routing: {
      send: {
        type: 'body',
        property: 'comment',
      },
    },
  },
  {
    displayName: 'Reaction Object (JSON)',
    name: 'reactionObject',
    type: 'json',
    displayOptions: { show: { resource: ['comments'], operation: ['reaction'] } },
    default: '{"reaction": { "kind": "like" }}',
    description: 'Reaction payload, e.g. {"reaction": { "kind": "like" }}',
    routing: {
      send: {
        type: 'body',
        property: 'reaction',
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { resource: ['comments'], operation: ['getAll'], returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { resource: ['comments'], operation: ['getAll'], returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['comments'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: { send: { paginate: '={{ $value }}' }, operations: { pagination: { type: 'offset', properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' } } } },
  },
];

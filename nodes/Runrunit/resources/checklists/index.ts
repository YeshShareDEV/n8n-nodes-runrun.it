import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklists = {
  resource: ['checklists'],
};

const showOnlyForChecklistWithId = {
  resource: ['checklists'],
  operation: ['get', 'create', 'update', 'delete'],
};

export const checklistsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForChecklists },
    options: [
      {
        name: 'Get',
        value: 'get',
        action: 'Get a checklist from a task',
        description: 'Show checklist linked to a task',
        routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/checklist' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create checklist from a task',
        description: 'Create checklist for a task',
        routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/checklist' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update checklist',
        description: 'Update checklist fields',
        routing: { request: { method: 'PUT', url: '=/tasks/{{$parameter.taskId}}/checklist' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete checklist',
        description: 'Remove checklist from a task',
        routing: { request: { method: 'DELETE', url: '=/tasks/{{$parameter.taskId}}/checklist' } },
      },
    ],
    default: 'get',
  },
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['checklists'], operation: ['get', 'create', 'update', 'delete'] } },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Checklist Object (JSON)',
    name: 'checklistObject',
    type: 'json',
    displayOptions: { show: { resource: ['checklists'], operation: ['create', 'update'] } },
    default: '{"checklist": {"title":""}}',
    description: 'Checklist payload, e.g. {"checklist": {"title": "Office Supplies"}}',
    routing: {
      send: {
        type: 'body',
        property: 'checklist',
      },
    },
  },
];

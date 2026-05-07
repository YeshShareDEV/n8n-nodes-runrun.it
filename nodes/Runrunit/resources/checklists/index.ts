import type { INodeProperties } from 'n8n-workflow';
import { checklistsGetDescription } from './get';
import { checklistsCreateDescription } from './create';
import { checklistsUpdateDescription } from './update';
import { checklistsDeleteDescription } from './delete';

export const checklistsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['checklists'] } },
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
  ...checklistsGetDescription,
  ...checklistsCreateDescription,
  ...checklistsUpdateDescription,
  ...checklistsDeleteDescription,
];

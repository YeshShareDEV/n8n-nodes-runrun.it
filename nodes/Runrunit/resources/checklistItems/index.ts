import type { INodeProperties } from 'n8n-workflow';
import { checklistItemsGetAllDescription } from './getAll';
import { checklistItemsGetDescription } from './get';
import { checklistItemsCreateDescription } from './create';
import { checklistItemsUpdateDescription } from './update';
import { checklistItemsDeleteDescription } from './delete';

export const checklistItemsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['checklistItems'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'List checklist items',
        description: 'List items for a checklist',
        routing: { request: { method: 'GET', url: '=/checklists/{{$parameter.checklistId}}/items' } },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a checklist item',
        description: 'Get a checklist item by id',
        routing: { request: { method: 'GET', url: '=/checklists/{{$parameter.checklistId}}/items/{{$parameter.itemId}}' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create checklist item',
        description: 'Create a new checklist item',
        routing: { request: { method: 'POST', url: '=/checklists/{{$parameter.checklistId}}/items' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update checklist item',
        description: 'Update an existing checklist item',
        routing: { request: { method: 'PUT', url: '=/checklists/{{$parameter.checklistId}}/items/{{$parameter.itemId}}' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete checklist item',
        description: 'Delete an item from a checklist',
        routing: { request: { method: 'DELETE', url: '=/checklists/{{$parameter.checklistId}}/items/{{$parameter.itemId}}' } },
      },
    ],
    default: 'getAll',
  },
  ...checklistItemsGetAllDescription,
  ...checklistItemsGetDescription,
  ...checklistItemsCreateDescription,
  ...checklistItemsUpdateDescription,
  ...checklistItemsDeleteDescription,
];

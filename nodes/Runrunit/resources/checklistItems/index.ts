import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItems = {
  resource: ['checklistItems'],
};

const showOnlyForChecklistItemWithId = {
  resource: ['checklistItems'],
  operation: ['get', 'update', 'delete'],
};

export const checklistItemsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForChecklistItems },
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
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: { resource: ['checklistItems'], operation: ['getAll', 'get', 'create', 'update', 'delete'] } },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemWithId },
    default: '',
    required: true,
    description: 'ID of the checklist item',
  },
  {
    displayName: 'Item Object (JSON)',
    name: 'itemObject',
    type: 'json',
    displayOptions: { show: { resource: ['checklistItems'], operation: ['create', 'update'] } },
    default: '{"description":""}',
    description: 'Checklist item payload, e.g. {"checklist_item": {"description": "Buy pencils", "checked": false}}',
    routing: {
      send: {
        type: 'body',
        property: 'checklist_item',
      },
    },
  },
];

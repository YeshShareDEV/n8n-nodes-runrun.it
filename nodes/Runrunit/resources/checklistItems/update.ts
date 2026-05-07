import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItemsUpdate = {
  resource: ['checklistItems'],
  operation: ['update'],
};

export const checklistItemsUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsUpdate },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsUpdate },
    default: '',
    required: true,
    description: 'ID of the checklist item to update',
  },
  {
    displayName: 'Item Object (JSON)',
    name: 'itemObject',
    type: 'json',
    displayOptions: { show: showOnlyForChecklistItemsUpdate },
    default: '{"description":""}',
    description: 'Checklist item payload sent as `checklist_item` in the body',
    routing: {
      send: {
        type: 'body',
        property: 'checklist_item',
      },
    },
  },
];

import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItemsCreate = {
  resource: ['checklistItems'],
  operation: ['create'],
};

export const checklistItemsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsCreate },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Item Object (JSON)',
    name: 'itemObject',
    type: 'json',
    displayOptions: { show: showOnlyForChecklistItemsCreate },
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

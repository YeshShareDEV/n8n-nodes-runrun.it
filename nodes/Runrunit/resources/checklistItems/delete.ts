import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItemsDelete = {
  resource: ['checklistItems'],
  operation: ['delete'],
};

export const checklistItemsDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsDelete },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsDelete },
    default: '',
    required: true,
    description: 'ID of the checklist item to delete',
  },
];

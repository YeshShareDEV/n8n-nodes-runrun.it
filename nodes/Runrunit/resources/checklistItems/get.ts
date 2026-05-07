import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistItemsGet = {
  resource: ['checklistItems'],
  operation: ['get'],
};

export const checklistItemsGetDescription: INodeProperties[] = [
  {
    displayName: 'Checklist ID',
    name: 'checklistId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsGet },
    default: '',
    description: 'ID of the checklist',
  },
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistItemsGet },
    default: '',
    required: true,
    description: 'ID of the checklist item',
  },
];

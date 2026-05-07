import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistsCreate = {
  resource: ['checklists'],
  operation: ['create'],
};

export const checklistsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistsCreate },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Checklist Object (JSON)',
    name: 'checklistObject',
    type: 'json',
    displayOptions: { show: showOnlyForChecklistsCreate },
    default: '{"title":""}',
    description: 'Checklist payload sent as `checklist` in the body',
    routing: {
      send: {
        type: 'body',
        property: 'checklist',
      },
    },
  },
];

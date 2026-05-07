import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistsUpdate = {
  resource: ['checklists'],
  operation: ['update'],
};

export const checklistsUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistsUpdate },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Checklist Object (JSON)',
    name: 'checklistObject',
    type: 'json',
    displayOptions: { show: showOnlyForChecklistsUpdate },
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

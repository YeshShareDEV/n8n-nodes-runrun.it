import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChecklistsGet = {
  resource: ['checklists'],
  operation: ['get'],
};

export const checklistsGetDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: showOnlyForChecklistsGet },
    default: '',
    description: 'ID of the task',
  },
];

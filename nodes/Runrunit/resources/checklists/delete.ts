import type { INodeProperties } from 'n8n-workflow';

export const checklistsDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['checklists'], operation: ['delete'] } },
    default: '',
    description: 'ID of the task',
  },
];

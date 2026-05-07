import type { INodeProperties } from 'n8n-workflow';

export const descendantsDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['descendants'], operation: ['delete'] } },
    default: '',
    required: true,
    description: 'ID of the parent task',
  },
  {
    displayName: 'Descendant ID',
    name: 'descendantId',
    type: 'string',
    displayOptions: { show: { resource: ['descendants'], operation: ['delete'] } },
    default: '',
    required: true,
    description: 'ID of the descendant to remove',
  },
];

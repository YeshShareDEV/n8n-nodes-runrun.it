import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentsCreate = {
  resource: ['documents'],
  operation: ['create'],
};

export const documentsCreateDescription: INodeProperties[] = [
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['documents'], operation: ['getAll', 'create'] } },
    default: '',
    required: true,
    description: 'ID of the task',
  },
  {
    displayName: 'Binary Property Name',
    name: 'binaryPropertyName',
    type: 'string',
    displayOptions: { show: showOnlyForDocumentsCreate },
    default: 'data',
    description: 'Name of the binary property that contains the file to upload (for example: data)',
  },
  {
    displayName: 'Document Object (JSON)',
    name: 'documentObject',
    type: 'json',
    displayOptions: { show: showOnlyForDocumentsCreate },
    default: '{}',
    description: 'Optional metadata to send with upload, e.g. {"document": {"filename":"report.pdf"}}. Metadata will be injected into the multipart request via the create operation preSend.',
  },
];

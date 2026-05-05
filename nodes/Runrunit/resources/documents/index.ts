import type { INodeProperties } from 'n8n-workflow';
import { documentsGetAllDescription } from './getAll';
import { documentsDocumentIdDescription } from './documentId';

const showOnlyForDocuments = {
  resource: ['documents'],
};

export const documentsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForDocuments },
    options: [
      {
        name: 'List by Task',
        value: 'getAll',
        action: 'List documents',
        description: 'List documents attached to a task',
        routing: { request: { method: 'GET', url: '=/tasks/{{$parameter.taskId}}/documents' } },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get document metadata',
        description: 'Return document metadata',
        routing: { request: { method: 'GET', url: '=/documents/{{$parameter.documentId}}' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete document',
        description: 'Delete a document',
        routing: { request: { method: 'DELETE', url: '=/documents/{{$parameter.documentId}}' } },
      },
    ],
    default: 'getAll',
  },
  ...documentsGetAllDescription,
  ...documentsDocumentIdDescription,
];

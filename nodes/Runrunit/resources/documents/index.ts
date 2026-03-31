import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocuments = {
  resource: ['documents'],
};

const showOnlyForDocumentWithId = {
  resource: ['documents'],
  operation: ['get', 'download', 'thumbnail', 'preview', 'mark_as_uploaded', 'delete'],
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
        name: 'Download',
        value: 'download',
        action: 'Download document',
        description: 'Download document binary',
        routing: { request: { method: 'GET', url: '=/documents/{{$parameter.documentId}}/download' } },
      },
      {
        name: 'Thumbnail',
        value: 'thumbnail',
        action: 'Get document thumbnail',
        description: 'Get document thumbnail',
        routing: { request: { method: 'GET', url: '=/documents/{{$parameter.documentId}}/thumbnail' } },
      },
      {
        name: 'Preview',
        value: 'preview',
        action: 'Get document preview',
        description: 'Get document preview',
        routing: { request: { method: 'GET', url: '=/documents/{{$parameter.documentId}}/preview' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Upload document',
        description: 'Upload a document to a task (multipart/form-data)',
        routing: { request: { method: 'POST', url: '=/tasks/{{$parameter.taskId}}/documents' } },
      },
      {
        name: 'Mark As Uploaded',
        value: 'mark_as_uploaded',
        action: 'Mark document as uploaded',
        description: 'Mark a previously uploaded document as uploaded',
        routing: { request: { method: 'POST', url: '=/documents/{{$parameter.documentId}}/mark_as_uploaded' } },
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
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    displayOptions: { show: { resource: ['documents'], operation: ['getAll', 'create'] } },
    default: '',
    description: 'ID of the task',
  },
  {
    displayName: 'Document ID',
    name: 'documentId',
    type: 'string',
    displayOptions: { show: showOnlyForDocumentWithId },
    default: '',
    required: true,
    description: 'ID of the document',
  },
  {
    displayName: 'File Path',
    name: 'filePath',
    type: 'string',
    displayOptions: { show: { resource: ['documents'], operation: ['create'] } },
    default: '',
    description: 'Local path to file to upload (n8n will read and send as multipart/form-data)',
  },
  {
    displayName: 'Document Object (JSON)',
    name: 'documentObject',
    type: 'json',
    displayOptions: { show: { resource: ['documents'], operation: ['create'] } },
    default: '{}',
    description: 'Optional metadata to send with upload, e.g. {"document": {"filename":"report.pdf"}}',
    routing: {
      send: {
        type: 'body',
        property: 'document',
      },
    },
  },
];

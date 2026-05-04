import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentWithId = {
  resource: ['documents'],
  operation: ['get', 'download', 'thumbnail', 'preview', 'mark_as_uploaded', 'delete'],
};

export const documentsDocumentIdDescription: INodeProperties[] = [
  {
    displayName: 'Document ID',
    name: 'documentId',
    type: 'string',
    displayOptions: { show: showOnlyForDocumentWithId },
    default: '',
    required: true,
    description: 'ID of the document',
  },
];

import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDescriptions = {
  resource: ['descriptions'],
};

export const descriptionsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForDescriptions },
    options: [
      {
        name: 'Query',
        value: 'get',
        action: 'Query descriptions',
        description: 'Query descriptions by subject_type and subject_id',
        routing: { request: { method: 'GET', url: '/descriptions' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update description',
        description: 'Create or update a project or task template description',
        routing: { request: { method: 'PUT', url: '/descriptions' } },
      },
    ],
    default: 'get',
  },
  {
    displayName: 'Subject Type',
    name: 'subject_type',
    type: 'options',
    options: [
      { name: 'Project', value: 'Project' },
      { name: 'TaskTemplate', value: 'TaskTemplate' },
      { name: 'Task', value: 'Task' },
    ],
    displayOptions: { show: { resource: ['descriptions'], operation: ['get'] } },
    default: 'Project',
    routing: {
      send: {
        type: 'query',
        property: 'subject_type',
      },
    },
    description: 'Subject type to query',
  },
  {
    displayName: 'Subject ID',
    name: 'subject_id',
    type: 'string',
    displayOptions: { show: { resource: ['descriptions'], operation: ['get'] } },
    default: '',
    routing: {
      send: {
        type: 'query',
        property: 'subject_id',
      },
    },
    description: 'ID of the subject to query',
  },
  {
    displayName: 'Description Object (JSON)',
    name: 'descriptionObject',
    type: 'json',
    displayOptions: { show: { resource: ['descriptions'], operation: ['update'] } },
    default: '{"description": {"subject_type": "Project", "subject_id": 123, "body": "..."}}',
    description: 'Description payload sent as `description` in the body',
    routing: {
      send: {
        type: 'body',
        property: 'description',
      },
    },
  },
];

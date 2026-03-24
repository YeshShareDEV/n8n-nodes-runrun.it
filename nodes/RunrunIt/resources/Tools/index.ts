import type { INodeProperties } from 'n8n-workflow';
import { toolsGetDescription } from './get';
import { toolsCreateDescription } from './create';
import { toolsUpdateDescription } from './update';
import { toolsDeleteDescription } from './delete';
import { toolsOptionsDescription } from './options';

const showOnlyForTools = { resource: ['Tools'] };

export const toolsDescription: INodeProperties[] = [
  {
    displayName: 'Sub-resource',
    name: 'subResource',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForTools },
    options: [
      { name: 'RSSFeed', value: 'RSSFeed', action: 'Manage RSS feeds' },
      { name: 'Reminder', value: 'Reminder', action: 'Manage reminders' },
    ],
    default: 'RSSFeed',
  },
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForTools },
    options: [
      { name: 'Get', value: 'get', action: 'Get a tool or list tools' },
      { name: 'Create', value: 'create', action: 'Create a tool instance' },
      { name: 'Update', value: 'update', action: 'Update a tool instance' },
      { name: 'Delete', value: 'delete', action: 'Delete a tool instance' },
    ],
    default: 'get',
  },

  // Item ID (when applicable)
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['Tools'], operation: ['get'] } },
    default: false,
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['Tools'], operation: ['get'], returnAll: [false] } },
    description: 'Limite de itens retornados quando Return All for false',
  },

  // Create/Update fields: placeholder collection for tool-specific data
  {
    displayName: 'Tool Data',
    name: 'toolData',
    type: 'collection',
    placeholder: 'Tool-specific fields',
    default: {},
    displayOptions: { show: { resource: ['Tools'], operation: ['create', 'update'] } },
    description: 'Fields vary per sub-resource; populate according to RSSFeed or Reminder requirements',
  },

  // Delete confirmation
  {
    displayName: 'Require Confirmation',
    name: 'requireConfirmation',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['Tools'], operation: ['delete'] } },
    description: 'Require confirmation before deleting a tool instance',
  },

  ...toolsGetDescription,
  ...toolsCreateDescription,
  ...toolsUpdateDescription,
  ...toolsDeleteDescription,
  ...toolsOptionsDescription,
];

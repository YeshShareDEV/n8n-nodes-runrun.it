import type { INodeProperties } from 'n8n-workflow';
import { setupGetDescription } from './get';
import { setupCreateDescription } from './create';
import { setupUpdateDescription } from './update';
import { setupDeleteDescription } from './delete';
import { setupOptionsDescription } from './options';

const showOnlyForSetup = { resource: ['Setup'] };

export const setupDescription: INodeProperties[] = [
  {
    displayName: 'Sub-resource',
    name: 'subResource',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForSetup },
    options: [
      { name: 'Config', value: 'Config', action: 'Manage configuration keys' },
      { name: 'LDAP Directory', value: 'LDAPDirectory', action: 'Manage LDAP directories' },
    ],
    default: 'Config',
  },
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForSetup },
    options: [
      { name: 'List', value: 'list', action: 'List items' },
      { name: 'Get', value: 'get', action: 'Get item' },
      { name: 'Create', value: 'create', action: 'Create item' },
      { name: 'Update', value: 'update', action: 'Update item' },
      { name: 'Delete', value: 'delete', action: 'Delete item' },
    ],
    default: 'list',
  },

  // Config-specific fields
  {
    displayName: 'Context',
    name: 'context',
    type: 'string',
    default: '',
    description: 'Configuration context (used for Config sub-resource)',
    displayOptions: { show: { subResource: ['Config'], resource: ['Setup'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'Configuration name/key (used for Config get/update/delete)',
    displayOptions: { show: { subResource: ['Config'], resource: ['Setup'] } },
  },

  // LDAP-specific ID for get/update/delete
  {
    displayName: 'LDAP Directory ID',
    name: 'ldapId',
    type: 'number',
    default: 0,
    typeOptions: { minValue: 1 },
    description: 'LDAP Directory numeric ID',
    displayOptions: { show: { subResource: ['LDAPDirectory'], operation: ['get', 'update', 'delete'], resource: ['Setup'] } },
  },

  // List controls
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { operation: ['list'], resource: ['Setup'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { operation: ['list'], returnAll: [false], resource: ['Setup'] } },
    description: 'Limite de itens retornados quando Return All for false',
  },

  // Config create/update: key/value editor
  {
    displayName: 'Config Entries',
    name: 'configEntries',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    placeholder: 'Add entry',
    default: [],
    displayOptions: { show: { subResource: ['Config'], operation: ['create', 'update'], resource: ['Setup'] } },
    options: [
      {
        name: 'entry',
        displayName: 'Entry',
        values: [
          { displayName: 'Key', name: 'key', type: 'string', default: '' },
          { displayName: 'Value', name: 'value', type: 'string', default: '' },
        ],
      },
    ],
  },

 
  // Delete confirmation for dangerous actions
  {
    displayName: 'Require Confirmation',
    name: 'requireConfirmation',
    type: 'boolean',
    default: true,
    displayOptions: { show: { operation: ['delete'], resource: ['Setup'] } },
    description: 'Require explicit confirmation before performing delete operations',
  },

  ...setupGetDescription,
  ...setupCreateDescription,
  ...setupUpdateDescription,
  ...setupDeleteDescription,
  ...setupOptionsDescription,
];


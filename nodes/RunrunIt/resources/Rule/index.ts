import type { INodeProperties } from 'n8n-workflow';
import { ruleGetDescription } from './get';
import { ruleCreateDescription } from './create';
import { ruleUpdateDescription } from './update';
import { ruleDeleteDescription } from './delete';
import { ruleOptionsDescription } from './options';

const showOnlyForRule = { resource: ['Rule'] };

export const ruleDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForRule },
    options: [
      { name: 'Get', value: 'get', action: 'Get a rule or list rules' },
      { name: 'Create', value: 'create', action: 'Create a rule' },
      { name: 'Update', value: 'update', action: 'Update a rule' },
      { name: 'Delete', value: 'delete', action: 'Delete a rule' },
    ],
    default: 'get',
  },
  {
    displayName: 'Collection',
    name: 'collection',
    type: 'string',
    default: '',
    description: 'Collection of rules (e.g., "global", "user", or specific scope)',
    displayOptions: { show: showOnlyForRule },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { operation: ['get'], resource: ['Rule'] } },
    default: false,
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: { minValue: 1 },
    displayOptions: { show: { resource: ['Rule'], operation: ['get'], returnAll: [false] } },
    description: 'Limite de itens retornados quando Return All for false',
  },
  // CREATE/UPDATE: criteria and actions
  {
    displayName: 'Criteria',
    name: 'criteria',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    placeholder: 'Add Criterion',
    default: [],
    displayOptions: { show: { resource: ['Rule'], operation: ['create', 'update'] } },
    options: [
      {
        name: 'criterion',
        displayName: 'Criterion',
        values: [
          { displayName: 'Condition', name: 'condition', type: 'options', options: [ { name: 'AND', value: 'AND' }, { name: 'OR', value: 'OR' } ], default: 'AND' },
          { displayName: 'Field', name: 'field', type: 'string', default: '' },
          { displayName: 'Operator', name: 'operator', type: 'string', default: '' },
          { displayName: 'Value', name: 'value', type: 'string', default: '' },
        ],
      },
    ],
  },
  {
    displayName: 'Actions',
    name: 'actions',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    placeholder: 'Add Action',
    default: [],
    displayOptions: { show: { resource: ['Rule'], operation: ['create', 'update'] } },
    options: [
      {
        name: 'action',
        displayName: 'Action',
        values: [
          { displayName: 'Action Field', name: 'actionField', type: 'string', default: '' },
          { displayName: 'Action Type', name: 'actionType', type: 'string', default: '' },
          { displayName: 'Action Value', name: 'actionValue', type: 'string', default: '' },
        ],
      },
    ],
  },
  // DELETE: confirmation
  {
    displayName: 'Require Confirmation',
    name: 'requireConfirmation',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['Rule'], operation: ['delete'] } },
    description: 'Require user confirmation before deleting a rule',
  },
  ...ruleGetDescription,
  ...ruleCreateDescription,
  ...ruleUpdateDescription,
  ...ruleDeleteDescription,
  ...ruleOptionsDescription,
];

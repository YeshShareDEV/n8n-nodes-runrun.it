import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjects = {
  resource: ['projects'],
  operation: ['getAll'],
};

export const projectsGetManyDescription: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['projects'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { ...showOnlyForProjects, returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination',
  },
  {
    displayName: 'Client ID',
    name: 'client_id',
    type: 'number',
    displayOptions: { show: showOnlyForProjects },
    default: 0,
    description: 'Filter by client id (optional — include only if provided)',
  },
  {
    displayName: 'Project Group ID',
    name: 'project_group_id',
    type: 'number',
    displayOptions: { show: showOnlyForProjects },
    default: 0,
    description: 'Filter by project group id (optional — include only if provided)',
  },
  {
    displayName: 'Search Term',
    name: 'search_term',
    type: 'string',
    displayOptions: { show: showOnlyForProjects },
    default: '',
    description: 'Search term to filter projects by name',
    routing: { send: { type: 'query', property: 'search_term' } },
  },
  {
    displayName: 'Is Closed',
    name: 'is_closed',
    type: 'options',
    default: 'all',
    displayOptions: { show: showOnlyForProjects },
    options: [
      { name: 'All', value: 'all' },
      { name: 'Open', value: 'false' },
      { name: 'Closed', value: 'true' },
    ],
    description: 'Filter by project status',
  },
  // === Filter Options (collection) ===
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      multipleValueButtonText: 'Add Filter',
    },
    default: {},
    placeholder: 'Add Filter',
    displayOptions: { show: showOnlyForProjects },
    description: 'Filter projects by field value',
    options: [
      {
        displayName: 'Filter',
        name: 'filter',
        values: [
          {
            displayName: 'Field',
            name: 'field',
            type: 'options',
            options: [
              { name: 'Project ID', value: 'id' },
              { name: 'Project Name', value: 'project_name' },
              { name: 'Client Name', value: 'client_name' },
              { name: 'Priority', value: 'priority' },
              { name: 'Created At', value: 'created_at' },
              { name: 'Last Activity At', value: 'last_activity_at' },
              { name: 'Is Working On', value: 'is_working_on' },
              { name: 'Time Worked (Sec)', value: 'time_worked' },
              { name: 'Tasks Count', value: 'tasks_count' },
            ],
            default: 'project_name',
            description: 'The field to filter by',
          },
          {
            displayName: 'Operator',
            name: 'operator',
            type: 'options',
            options: [
              { name: 'Equals', value: 'equals' },
              { name: 'Contains', value: 'contains' },
              { name: 'Greater Than', value: 'gt' },
              { name: 'Less Than', value: 'lt' },
              { name: 'Is True', value: 'isTrue' },
              { name: 'Is False', value: 'isFalse' },
            ],
            default: 'equals',
            description: 'The comparison operator',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'The value to compare against',
          },
        ],
      },
    ],
  },
];

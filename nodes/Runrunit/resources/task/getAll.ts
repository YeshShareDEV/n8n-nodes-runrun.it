import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTasks = {
    resource: ['task'],
    operation: ['getAll'],
};

export const taskGetManyDescription: INodeProperties[] = [
    // === Filtros da API (Filtros nativos do Runrunit) ===
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: { show: showOnlyForTasks },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                ...showOnlyForTasks,
                returnAll: [false],
            },
        },
        default: 50,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        displayOptions: {
            show: {
                ...showOnlyForTasks,
                returnAll: [false],
            },
        },
        default: 1,
        description: 'Page number for pagination',
    },
    {
        displayName: 'Search Term',
        name: 'search_term',
        type: 'string',
        displayOptions: { show: showOnlyForTasks },
        default: '',
        description: 'Search term to filter tasks',
    },
    {
        displayName: 'Project ID',
        name: 'project_id',
        type: 'number',
        displayOptions: { show: showOnlyForTasks },
        default: 0,
        description: 'Filter by project id (0 = ignore)',
    },
    {
        displayName: 'Client ID',
        name: 'client_id',
        type: 'number',
        displayOptions: { show: showOnlyForTasks },
        default: 0,
        description: 'Filter by client id (0 = ignore)',
    },
    {
        displayName: 'Responsible ID',
        name: 'responsible_id',
        type: 'string',
        displayOptions: { show: showOnlyForTasks },
        default: '',
        description: 'Filter by responsible user id',
    },
    {
        displayName: 'Is Closed',
        name: 'is_closed',
        type: 'options',
        default: 'all',
        displayOptions: { show: showOnlyForTasks },
        options: [
            { name: 'All', value: 'all' },
            { name: 'Open', value: 'false' },
            { name: 'Closed', value: 'true' },
        ],
        description: 'Filter by task status',
    }, // === Filter Options (collection) ===
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
        displayOptions: { show: showOnlyForTasks },
        description: 'Filter tasks by field value',
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
                            { name: 'Task ID', value: 'id' },
                            { name: 'Title', value: 'title' },
                            { name: 'Project Name', value: 'project_name' },
                            { name: 'Client Name', value: 'client_name' },
                            { name: 'Priority', value: 'priority' },
                            { name: 'Created At', value: 'created_at' },
                            { name: 'Last Activity At', value: 'last_activity_at' },
                            { name: 'Is Working On', value: 'is_working_on' },
                            { name: 'Time Worked (Sec)', value: 'time_worked' },
                        ],
                        default: 'title',
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
    {
        displayName: 'Sort',
        name: 'sort',
        type: 'options',
        displayOptions: { show: showOnlyForTasks },
        options: [
            { name: '—', value: '' },
            { name: 'ID', value: 'id' },
            { name: 'Title', value: 'title' },
            { name: 'Client Name', value: 'client_name' },
            { name: 'Is Closed', value: 'is_closed' },
            { name: 'Project Name', value: 'project_name' },
            { name: 'Last Activity At', value: 'last_activity_at' },
            { name: 'Created At', value: 'created_at' },
        ],
        default: '',
        description: 'Field to sort results by',
        routing: { send: { type: 'query', property: 'sort' } },
    },
    {
        displayName: 'Sort Direction',
        name: 'sort_dir',
        type: 'options',
        displayOptions: { show: showOnlyForTasks, hide: { sort: [''] } },
        options: [
            { name: 'Ascending', value: 'asc' },
            { name: 'Descending', value: 'desc' },
        ],
        default: 'asc',
        description: 'Direction to sort the results',
        routing: { send: { type: 'query', property: 'sort_dir' } },
    },

];
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
        displayOptions: { show: { resource: ['task'] } },
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
        displayName: 'Filter Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: showOnlyForTasks },
        options: [
            {
                displayName: 'Ignore Case',
                name: 'ignoreCase',
                type: 'boolean',
                default: true,
                description: 'Whether comparisons should be case-insensitive',
            },
            {
                displayName: 'Loose Type Validation',
                name: 'looseTypeValidation',
                type: 'boolean',
                default: true,
                description: 'Allow loose type conversion (e.g. string "123" == number 123)',
            }, // Campos disponíveis para filtrar (seleção múltipla)
            {
                displayName: 'Fields to Filter',
                name: 'fieldsToFilter',
                type: 'multiOptions',
                options: [
                    { name: 'Task ID', value: 'id' },
                    { name: 'Title', value: 'title' },
                    { name: 'Project Name', value: 'project_name' },
                    { name: 'Client Name', value: 'client_name' },
                    { name: 'Priority', value: 'priority' },
                    { name: 'Created At', value: 'created_at' },
                    { name: 'Is Working On', value: 'is_working_on' },
                    { name: 'Time Worked (Sec)', value: 'time_worked' },
                ],
                default: [],
                description: 'Select which fields to use in filtering',
            },
        ],
    }, // === Conditions (filter) ===
    {
        displayName: 'Conditions',
        name: 'conditions',
        placeholder: 'Add Condition',
        type: 'filter',
        default: {},
        displayOptions: { show: showOnlyForTasks },
        typeOptions: {
            filter: {
                caseSensitive: '={{!$parameter["options"]["ignoreCase"]}}',
                typeValidation: '={{$parameter["options"]["looseTypeValidation"] ? "loose" : "strict"}}',
                version: 1,
            },
        },
        description: 'Post-filter the returned tasks using the Conditions UI',
    },

];
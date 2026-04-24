import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTasks = {
    resource: ['task'],
    operation: ['getAll'],
};

export const taskGetManyDescription: INodeProperties[] = [
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
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: { show: showOnlyForTasks },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
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
        default: 0,
        displayOptions: { show: showOnlyForTasks },
        description: 'Filter by project id (0 to ignore)',
    },
    {
        displayName: 'Responsible ID',
        name: 'responsible_id',
        type: 'string',
        default: '',
        displayOptions: { show: showOnlyForTasks },
        description: 'Filter by responsible user id',
    },
    {
        displayName: 'Is Closed',
        name: 'is_closed',
        type: 'options',
        default: 'all',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Open', value: 'false' },
            { name: 'Closed', value: 'true' },
        ],
        displayOptions: { show: showOnlyForTasks },
        description: 'Filter by closed/open/all tasks',
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
        description: 'Page number for pagination (1-based)',
    },
    // duplicate search_term removed
    ];
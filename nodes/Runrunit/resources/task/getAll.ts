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
        {
            displayName: 'Search Term',
            name: 'search_term',
            type: 'string',
            displayOptions: { show: showOnlyForTasks },
            default: '',
            description: 'Search term to filter tasks',
        },
    ];
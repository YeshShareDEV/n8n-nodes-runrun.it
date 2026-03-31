import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTimeWorked = {
    resource: ['timeWorked'],
};

export const timeWorkedDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: showOnlyForTimeWorked },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get time worked report',
                description: 'List time worked (grouped/filtered)',
                routing: { request: { method: 'GET', url: '/reports/time_worked' } },
            },
        ],
        default: 'get',
    },
];

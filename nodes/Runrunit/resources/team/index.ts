import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTeams = {
    resource: ['team'],
};

const showOnlyForTeamWithId = {
    resource: ['team'],
    operation: ['get', 'update', 'delete', 'add_member', 'remove_member'],
};

export const teamDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: showOnlyForTeams },
        options: [
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get teams',
                description: 'Get many teams',
                routing: { request: { method: 'GET', url: '/teams' } },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a team',
                description: 'Get a single team',
                routing: { request: { method: 'GET', url: '=/teams/{{$parameter.teamId}}' } },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a team',
                description: 'Create a new team',
                routing: { request: { method: 'POST', url: '/teams' } },
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a team',
                description: 'Update a team',
                routing: { request: { method: 'PUT', url: '=/teams/{{$parameter.teamId}}' } },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a team',
                description: 'Delete a team',
                routing: { request: { method: 'DELETE', url: '=/teams/{{$parameter.teamId}}' } },
            },
            {
                name: 'Add Member',
                value: 'add_member',
                action: 'Add a user to a team',
                description: 'Add user to team',
                routing: { request: { method: 'POST', url: '=/teams/{{$parameter.teamId}}/add_member' } },
            },
            {
                name: 'Remove Member',
                value: 'remove_member',
                action: 'Remove a user from a team',
                description: 'Remove user from team',
                routing: { request: { method: 'POST', url: '=/teams/{{$parameter.teamId}}/remove_member' } },
            },
        ],
        default: 'getAll',
    },
    {
        displayName: 'Team ID',
        name: 'teamId',
        type: 'string',
        displayOptions: { show: showOnlyForTeamWithId },
        default: '',
        required: true,
        description: 'ID of the team',
    },
    {
        displayName: 'Team Object (JSON)',
        name: 'teamObject',
        type: 'json',
        displayOptions: { show: { resource: ['team'], operation: ['create', 'update'] } },
        default: '{}',
        description: 'Team object to create or update, sent as `team` in the body',
        routing: {
            send: {
                type: 'body',
                property: 'team',
            },
        },
    },
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        displayOptions: { show: { resource: ['team'], operation: ['add_member', 'remove_member'] } },
        default: '',
        description: 'ID of the user to add or remove from the team',
        routing: {
            send: {
                type: 'body',
                property: 'user_id',
            },
        },
    },
];

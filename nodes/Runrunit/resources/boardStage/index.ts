import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStages = {
    resource: ['boardStage'],
};

const showOnlyForBoardStageWithId = {
    resource: ['boardStage'],
    operation: ['get', 'update', 'delete', 'move', 'update_use_latency_time', 'update_use_scrum_points'],
};

export const boardStageDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: showOnlyForBoardStages },
        options: [
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get board stages',
                description: 'List all board stages',
                routing: { request: { method: 'GET', url: '=/boards/{{$parameter.boardId}}/stages' } },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a board stage',
                description: 'Show a board stage',
                routing: { request: { method: 'GET', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}' } },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a board stage',
                description: 'Create a new board stage',
                routing: { request: { method: 'POST', url: '=/boards/{{$parameter.boardId}}/stages' } },
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a board stage',
                description: 'Update an existing board stage',
                routing: { request: { method: 'PUT', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}' } },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a board stage',
                description: 'Destroy a board stage',
                routing: { request: { method: 'DELETE', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}' } },
            },
            {
                name: 'Move',
                value: 'move',
                action: 'Move a board stage',
                description: 'Move a board stage to another group position',
                routing: { request: { method: 'POST', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}/move' } },
            },
            {
                name: 'Update Use Latency Time',
                value: 'update_use_latency_time',
                action: 'Update use latency time',
                description: 'Enable or disable latency time usage for the stage',
                routing: { request: { method: 'POST', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}/update_use_latency_time' } },
            },
            {
                name: 'Update Use Scrum Points',
                value: 'update_use_scrum_points',
                action: 'Update use scrum points',
                description: 'Enable or disable scrum points usage for the stage',
                routing: { request: { method: 'POST', url: '=/boards/{{$parameter.boardId}}/stages/{{$parameter.stageId}}/update_use_scrum_points' } },
            },
        ],
        default: 'getAll',
    },
    {
        displayName: 'Board ID',
        name: 'boardId',
        type: 'string',
        displayOptions: { show: showOnlyForBoardStages },
        default: '',
        required: true,
        description: 'ID of the board',
    },
    {
        displayName: 'Stage ID',
        name: 'stageId',
        type: 'string',
        displayOptions: { show: showOnlyForBoardStageWithId },
        default: '',
        required: true,
        description: 'ID of the stage',
    },
    {
        displayName: 'Stage Object (JSON)',
        name: 'stageObject',
        type: 'json',
        displayOptions: { show: { resource: ['boardStage'], operation: ['create', 'update'] } },
        default: '{}',
        description: 'Stage object to create or update, sent as `stage` in the body',
        routing: {
            send: {
                type: 'body',
                property: 'stage',
            },
        },
    },
    {
        displayName: 'Position',
        name: 'position',
        type: 'number',
        displayOptions: { show: { resource: ['boardStage'], operation: ['move'] } },
        default: 0,
        description: 'Destination position for the stage (send as `position` in body)',
        routing: {
            send: {
                type: 'body',
                property: 'position',
            },
        },
    },
    {
        displayName: 'Use Latency Time',
        name: 'useLatencyTime',
        type: 'boolean',
        displayOptions: { show: { resource: ['boardStage'], operation: ['update_use_latency_time'] } },
        default: false,
        description: 'Whether the stage should use latency time (sent as `use_latency_time`)',
        routing: {
            send: {
                type: 'body',
                property: 'use_latency_time',
            },
        },
    },
    {
        displayName: 'Use Scrum Points',
        name: 'useScrumPoints',
        type: 'boolean',
        displayOptions: { show: { resource: ['boardStage'], operation: ['update_use_scrum_points'] } },
        default: false,
        description: 'Whether the stage should use scrum points (sent as `use_scrum_points`)',
        routing: {
            send: {
                type: 'body',
                property: 'use_scrum_points',
            },
        },
    },
];

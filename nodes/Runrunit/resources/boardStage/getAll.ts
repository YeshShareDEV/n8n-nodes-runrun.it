import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageGetAll = {
  resource: ['boardStage'],
  operation: ['getAll'],
};

export const boardStageGetAllDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageGetAll },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: showOnlyForBoardStageGetAll },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    routing: {
      send: { paginate: '={{ $value }}' },
      operations: {
        pagination: {
          type: 'offset',
          properties: { limitParameter: 'limit', offsetParameter: 'offset', pageSize: 100, type: 'query' },
        },
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: { show: { ...showOnlyForBoardStageGetAll, returnAll: [false] } },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
    routing: { send: { type: 'query', property: 'limit' }, output: { maxResults: '={{$value}}' } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: { show: { ...showOnlyForBoardStageGetAll, returnAll: [false] } },
    default: 1,
    description: 'Page number for pagination (1-based)',
    routing: { send: { type: 'query', property: 'page' } },
  },
];

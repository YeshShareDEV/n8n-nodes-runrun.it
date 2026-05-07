import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageActions = {
  resource: ['boardStage'],
  operation: ['update_use_latency_time', 'update_use_scrum_points'],
};

export const boardStageActionsDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageActions },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageActions },
    default: '',
    required: true,
    description: 'ID of the stage',
  },
  {
    displayName: 'Use Latency Time',
    name: 'useLatencyTime',
    type: 'boolean',
    displayOptions: { show: { resource: ['boardStage'], operation: ['update_use_latency_time'] } },
    default: false,
    description: 'Whether the stage should use latency time',
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
    description: 'Whether the stage should use scrum points',
    routing: {
      send: {
        type: 'body',
        property: 'use_scrum_points',
      },
    },
  },
];

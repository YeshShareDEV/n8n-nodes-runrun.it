import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageUpdate = {
  resource: ['boardStage'],
  operation: ['update'],
};

export const boardStageUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageUpdate },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageUpdate },
    default: '',
    required: true,
    description: 'ID of the stage to update',
  },
  {
    displayName: 'Stage Object (JSON)',
    name: 'stageObject',
    type: 'json',
    displayOptions: { show: showOnlyForBoardStageUpdate },
    default: '{}',
    description: 'Stage object to update, sent as `stage` in the body',
    routing: {
      send: {
        type: 'body',
        property: 'stage',
      },
    },
  },
];

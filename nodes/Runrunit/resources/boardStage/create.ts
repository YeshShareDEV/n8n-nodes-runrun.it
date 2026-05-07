import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageCreate = {
  resource: ['boardStage'],
  operation: ['create'],
};

export const boardStageCreateDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageCreate },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage Object (JSON)',
    name: 'stageObject',
    type: 'json',
    displayOptions: { show: showOnlyForBoardStageCreate },
    default: '{}',
    description: 'Stage object to create, sent as `stage` in the body',
    routing: {
      send: {
        type: 'body',
        property: 'stage',
      },
    },
  },
];

import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageGet = {
  resource: ['boardStage'],
  operation: ['get'],
};

export const boardStageGetDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageGet },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageGet },
    default: '',
    required: true,
    description: 'ID of the stage',
  },
];

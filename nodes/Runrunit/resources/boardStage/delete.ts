import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageDelete = {
  resource: ['boardStage'],
  operation: ['delete'],
};

export const boardStageDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageDelete },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageDelete },
    default: '',
    required: true,
    description: 'ID of the stage to delete',
  },
];

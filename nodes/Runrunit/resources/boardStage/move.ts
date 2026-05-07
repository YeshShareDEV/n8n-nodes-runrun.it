import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBoardStageMove = {
  resource: ['boardStage'],
  operation: ['move'],
};

export const boardStageMoveDescription: INodeProperties[] = [
  {
    displayName: 'Board ID',
    name: 'boardId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageMove },
    default: '',
    required: true,
    description: 'ID of the board',
  },
  {
    displayName: 'Stage ID',
    name: 'stageId',
    type: 'string',
    displayOptions: { show: showOnlyForBoardStageMove },
    default: '',
    required: true,
    description: 'ID of the stage to move',
  },
  {
    displayName: 'Position',
    name: 'position',
    type: 'number',
    displayOptions: { show: showOnlyForBoardStageMove },
    default: 0,
    description: 'Destination position for the stage (sent as `position` in body)',
    routing: {
      send: {
        type: 'body',
        property: 'position',
      },
    },
  },
];

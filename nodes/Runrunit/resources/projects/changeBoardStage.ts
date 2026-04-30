import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChangeBoard = {
  resource: ['projects'],
  operation: ['change_board_stage'],
};

export const projectChangeBoardStageDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForChangeBoard },
    default: '',
    required: true,
    description: 'ID of the project',
  },
  {
    displayName: 'Change Board Stage Object (JSON)',
    name: 'changeBoardStageObject',
    type: 'json',
    displayOptions: { show: showOnlyForChangeBoard },
    default: '{}',
    description: 'Payload, e.g. {"board_stage_id":1}',
  },
];

import type { INodeProperties } from 'n8n-workflow';
import { boardStageGetAllDescription } from './getAll';
import { boardStageGetDescription } from './get';
import { boardStageCreateDescription } from './create';
import { boardStageUpdateDescription } from './update';
import { boardStageDeleteDescription } from './delete';
import { boardStageMoveDescription } from './move';
import { boardStageActionsDescription } from './actions';

export const boardStageDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['boardStage'] } },
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
  ...boardStageGetAllDescription,
  ...boardStageGetDescription,
  ...boardStageCreateDescription,
  ...boardStageUpdateDescription,
  ...boardStageDeleteDescription,
  ...boardStageMoveDescription,
  ...boardStageActionsDescription,
];

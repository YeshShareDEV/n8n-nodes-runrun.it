import type { INodeProperties } from 'n8n-workflow';
import { projectsGetManyDescription } from './getAll';
import { projectGetDescription } from './get';
import { projectCreateDescription } from './create';
import { projectUpdateDescription } from './update';
import { projectRelatedUsersDescription } from './relatedUsers';
import { projectMoveDescription } from './move';
import { projectShareDescription } from './share';
import { projectUnshareDescription } from './unshare';
import { projectCloneDescription } from './clone';
import { projectChangeBoardStageDescription } from './changeBoardStage';
import { projectsFiltersDescription } from './filters';

export const projectsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['projects'] } },
    options: [
      { name: 'Get Many', value: 'getAll', action: 'Get many projects', routing: { request: { method: 'GET', url: '/projects' } } },
      { name: 'Get', value: 'get', action: 'Get a project', routing: { request: { method: 'GET', url: '=/projects/{{$parameter.projectId}}' } } },
      { name: 'Create', value: 'create', action: 'Create a project', routing: { request: { method: 'POST', url: '/projects' } } },
      { name: 'Update', value: 'update', action: 'Update a project', routing: { request: { method: 'PUT', url: '=/projects/{{$parameter.projectId}}' } } },
      { name: 'Related Users', value: 'related_users', action: 'List related users', routing: { request: { method: 'GET', url: '=/projects/{{$parameter.projectId}}/related_users' } } },
      { name: 'Move', value: 'move', action: 'Move project', routing: { request: { method: 'POST', url: '=/projects/{{$parameter.projectId}}/move' } } },
      { name: 'Share', value: 'share', action: 'Share project', routing: { request: { method: 'POST', url: '=/projects/{{$parameter.projectId}}/share' } } },
      { name: 'Unshare', value: 'unshare', action: 'Unshare project', routing: { request: { method: 'POST', url: '=/projects/{{$parameter.projectId}}/unshare' } } },
      { name: 'Clone', value: 'clone', action: 'Clone project', routing: { request: { method: 'POST', url: '=/projects/{{$parameter.projectId}}/clone' } } },
      { name: 'Change Board Stage', value: 'change_board_stage', action: 'Change board stage', routing: { request: { method: 'POST', url: '=/projects/{{$parameter.projectId}}/change_board_stage' } } },
      { name: 'List Filters', value: 'getAll_filters', action: 'List project filters', routing: { request: { method: 'GET', url: '/projects/filters' } } },
      { name: 'Get Filter', value: 'get_filter', action: 'Get a project filter', routing: { request: { method: 'GET', url: '=/projects/filters/{{$parameter.filterId}}' } } },
      { name: 'Delete Filter', value: 'delete_filter', action: 'Delete a project filter', routing: { request: { method: 'DELETE', url: '=/projects/filters/{{$parameter.filterId}}' } } },
    ],
    default: 'getAll',
  },
  ...projectsGetManyDescription,
  ...projectGetDescription,
  ...projectCreateDescription,
  ...projectUpdateDescription,
  ...projectRelatedUsersDescription,
  ...projectMoveDescription,
  ...projectShareDescription,
  ...projectUnshareDescription,
  ...projectCloneDescription,
  ...projectChangeBoardStageDescription,
  ...projectsFiltersDescription,
];

import type { INodeProperties } from 'n8n-workflow';
import { teamGetAllDescription } from './getAll';
import { teamGetDescription } from './get';
import { teamCreateDescription } from './create';
import { teamUpdateDescription } from './update';
import { teamDeleteDescription } from './delete';
import { teamMembersDescription } from './members';

export const teamDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['team'] } },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get teams',
        description: 'Get many teams',
        routing: { request: { method: 'GET', url: '/teams' } },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a team',
        description: 'Get a single team',
        routing: { request: { method: 'GET', url: '=/teams/{{$parameter.teamId}}' } },
      },
      {
        name: 'Create',
        value: 'create',
        action: 'Create a team',
        description: 'Create a new team',
        routing: { request: { method: 'POST', url: '/teams' } },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a team',
        description: 'Update a team',
        routing: { request: { method: 'PUT', url: '=/teams/{{$parameter.teamId}}' } },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a team',
        description: 'Delete a team',
        routing: { request: { method: 'DELETE', url: '=/teams/{{$parameter.teamId}}' } },
      },
      {
        name: 'Add Member',
        value: 'add_member',
        action: 'Add a user to a team',
        description: 'Add user to team',
        routing: { request: { method: 'POST', url: '=/teams/{{$parameter.teamId}}/add_member' } },
      },
      {
        name: 'Remove Member',
        value: 'remove_member',
        action: 'Remove a user from a team',
        description: 'Remove user from team',
        routing: { request: { method: 'POST', url: '=/teams/{{$parameter.teamId}}/remove_member' } },
      },
    ],
    default: 'getAll',
  },
  ...teamGetAllDescription,
  ...teamGetDescription,
  ...teamCreateDescription,
  ...teamUpdateDescription,
  ...teamDeleteDescription,
  ...teamMembersDescription,
];

import type { INodeProperties } from 'n8n-workflow';

const showMembers = { resource: ['team'], operation: ['add_member', 'remove_member'] };

export const teamMembersDescription: INodeProperties[] = [
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    displayOptions: { show: showMembers },
    default: '',
    required: true,
    description: 'ID of the team',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: { show: showMembers },
    default: '',
    description: 'ID of the user to add or remove from the team',
    routing: { send: { type: 'body', property: 'user_id' } },
  },
];

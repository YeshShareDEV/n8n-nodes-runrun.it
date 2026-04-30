import type { INodeProperties } from 'n8n-workflow';

const showOnlyForShare = {
  resource: ['projects'],
  operation: ['share'],
};

export const projectShareDescription: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    displayOptions: { show: showOnlyForShare },
    default: '',
    required: true,
    description: 'ID of the project to share',
  },
  {
    displayName: 'Share Object (JSON)',
    name: 'shareObject',
    type: 'json',
    displayOptions: { show: showOnlyForShare },
    default: '{}',
    description: 'Payload, e.g. {"sharing_details":["desired_date"],"guests_params":[{"email":"a@b.com"}] }',
  },
];

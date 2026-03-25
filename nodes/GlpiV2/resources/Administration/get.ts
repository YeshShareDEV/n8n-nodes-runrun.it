import type { INodeProperties } from 'n8n-workflow';

export const administrationGetDescription: INodeProperties[] = [
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select the Administration sub-resource (Entity, Group, Profile, User)',
		default: 'Administration/Entity',
		options: [
			{ name: 'Entity', value: 'Administration/Entity' },
			{ name: 'Group', value: 'Administration/Group' },
			{ name: 'Profile', value: 'Administration/Profile' },
			{ name: 'User', value: 'Administration/User' },
		],
		displayOptions: { show: { resource: ['Administration'], operation: ['get'] } },
	},

	{
		displayName: 'Notice',
		name: 'notice_get_admin',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['get'] } },
		description:
			'GET: provide `Item ID` to fetch a single item, or leave empty to list items. Example route: /api.php/Administration/User/123',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Administration'] } },
		options: [
			{
				displayName: 'Filter String',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Example: name=ilike=*Yesh*',
			},
		],
	},
];

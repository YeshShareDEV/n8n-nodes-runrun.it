import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class RunrunitApi implements ICredentialType {
	name = 'runrunitApi';

	displayName = 'Runrunit API';

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-runrunit?tab=readme-ov-file#credentials';

	icon: Icon = ('file:runrunit.svg' as unknown) as Icon;

	properties: INodeProperties[] = [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'User Token',
			name: 'userToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'App-Key': '={{$credentials.appKey}}',
				'User-Token': '={{$credentials.userToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://runrun.it/api/v1.0',
			url: '/users',
		},
	};
}

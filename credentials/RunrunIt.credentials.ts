import type { ICredentialType, ICredentialTestRequest, INodeProperties, Icon } from 'n8n-workflow';

export class RunrunItApi implements ICredentialType {
	name = 'runrunItApi';

	displayName = 'runrun.it API';

	icon: Icon = { light: 'file:../icons/runrunit.svg', dark: 'file:../icons/runrunit.dark.svg' };

	documentationUrl = 'https://atendimento.centrium.com.br/api.php/v2.1/doc.JSON';

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.host.replace(/\\/+$, "") + "/api.php"}}/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body:
				'={"grant_type":"password","client_id":"' + "{{$credentials.clientId}}" + '","client_secret":"' + "{{$credentials.clientSecret}}" + '","username":"' + "{{$credentials.username}}" + '","password":"' + "{{$credentials.password}}" + '","scope":"' + "{{$credentials.scope}}" + '"}',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'runrun.it URL',
			name: 'host',
			type: 'string',
			default: '',
			placeholder: 'https://app.runrun.it',
			required: true,
			description: 'URL base do runrun.it (sem /api - será adicionado automaticamente)',
		},
		// Authorization Code Flow removed: this integration uses the Resource Owner Password Credentials grant
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'api graphql',
			required: true,
			description: 'Escopos de acesso para o token OAuth2 (ex: api graphql)',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'Client ID gerado no runrun.it (Setup > OAuth Clients)',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Client Secret gerado no runrun.it',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
			description: 'Usuário do runrun.it a ser autenticado',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Senha do usuário do runrun.it',
		},
	];
}

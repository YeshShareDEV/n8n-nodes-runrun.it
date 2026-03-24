import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RunrunItApi implements ICredentialType {
  name = 'runrunitApi';
  displayName = 'Runrun.it API';
  documentationUrl = 'https://runrun.it';
  properties: INodeProperties[] = [
    {
      displayName: 'App Key',
      name: 'appKey',
      type: 'string',
      default: '',
      description: 'Application key (App-Key header)'
    },
    {
      displayName: 'User Token',
      name: 'userToken',
      type: 'string',
      default: '',
      description: 'User token (User-Token header)'
    }
  ];
}

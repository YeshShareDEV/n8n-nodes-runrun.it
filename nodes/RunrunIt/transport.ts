import { 
	IExecuteFunctions, 
	ILoadOptionsFunctions, 
	IHttpRequestOptions,
} from 'n8n-workflow';

const BASE_URL = 'https://runrun.it';

export async function runrunitApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  path: string,
  data?: any,
  params?: any,
) {
  const credentials = await this.getCredentials('runrunitApi') as {
    appKey?: string;
    userToken?: string;
  };

  if (!credentials || !credentials.appKey || !credentials.userToken) {
    throw new Error('Runrun.it credentials are missing (appKey/userToken)');
  }

  const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = {
    'App-Key': credentials.appKey,
    'User-Token': credentials.userToken,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  } as Record<string, string>;

  const options: IHttpRequestOptions = {
    method: method as any,
    url,
    headers,
    json: true,
  };

  if (typeof data !== 'undefined') {
    options.body = data;
  }

  if (typeof params !== 'undefined') {
    options.qs = params;
  }

  return await this.helpers.httpRequest(options);
}

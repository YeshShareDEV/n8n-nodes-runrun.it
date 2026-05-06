import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);

  throw new NodeOperationError(instance.getNode(), 'Operation not supported for User');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const path = '/users';
  const userPayload = safeParseJSON(instance, 'userObject', 0) as any;
  const body = { user: userPayload, make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', 0) };
  const resp = await makeRequest(instance, 'POST', path, body);
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const userId = instance.getNodeParameter('userId', 0) as string;
  if (!userId) throw new NodeOperationError(instance.getNode(), 'User ID is required for update');
  const path = `/users/${userId}`;
  const userPayload = safeParseJSON(instance, 'userObject', 0) as any;
  const body = { user: userPayload, make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', 0) };
  const resp = await makeRequest(instance, 'PUT', path, body);
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const userId = instance.getNodeParameter('userId', 0) as string;
  if (!userId) throw new NodeOperationError(instance.getNode(), 'User ID is required for get');
  const path = `/users/${userId}`;
  const resp = await makeRequest(instance, 'GET', path, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else {
    qs.limit = instance.getNodeParameter('limit', 0, 50);
    qs.page = instance.getNodeParameter('page', 0, 1);
  }
  const resp = await makeRequest(instance, 'GET', '/users', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.users || resp.data || resp.items || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  const filters = instance.getNodeParameter('filters', 0, {}) as any;
  const hasFilters = !!(filters?.filter?.length > 0);
  const hasData = items && items.length > 0;

  if (hasFilters && hasData) {
    const finalItems = await applyPostFilters(instance, items, 0);
    return [finalItems];
  }
  return [items];
}

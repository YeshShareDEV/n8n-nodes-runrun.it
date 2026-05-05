import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);

  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Clients');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const payload = safeParseJSON(instance, 'clientObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/clients', { client: payload });
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for update');
  const payload = safeParseJSON(instance, 'clientObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/clients/${id}`, { client: payload });
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for get');
  const resp = await makeRequest(instance, 'GET', `/clients/${id}`, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else { qs.limit = instance.getNodeParameter('limit', 0, 50); qs.page = instance.getNodeParameter('page', 0, 1); }
  const resp = await makeRequest(instance, 'GET', '/clients', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.clients || resp.data || resp.items || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  for (let i = 0; i < inputCount; i++) {
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

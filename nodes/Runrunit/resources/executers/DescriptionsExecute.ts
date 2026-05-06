import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Descriptions');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const payload = safeParseJSON(instance, 'descriptionObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/descriptions', { description: payload });
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('descriptionId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Description ID required for update');
  const payload = safeParseJSON(instance, 'descriptionObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/descriptions/${id}`, { description: payload });
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('descriptionId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Description ID required for get');
  const resp = await makeRequest(instance, 'GET', `/descriptions/${id}`, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else { qs.limit = instance.getNodeParameter('limit', 0, 50); qs.page = instance.getNodeParameter('page', 0, 1); }
  const resp = await makeRequest(instance, 'GET', '/descriptions', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.descriptions || resp.data || resp.items || [resp];
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

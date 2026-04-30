import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'getAll_filters') return await handleGetAll(instance);
  if (operation === 'get_filter') return await handleGet(instance);
  if (operation === 'delete_filter') return await handleDelete(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Projects');
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  for (let i = 0; i < inputCount; i++) {
    const qs: Record<string, any> = {};
    const returnAll = instance.getNodeParameter('returnAll', i) as boolean;
    if (returnAll) qs.limit = 1000;
    else { qs.limit = instance.getNodeParameter('limit', i, 50); qs.page = instance.getNodeParameter('page', i, 1); }
    const resp = await makeRequest(instance, 'GET', '/projects/filters', {}, qs);
    let normalizedArray: any[] = [];
    if (Array.isArray(resp)) normalizedArray = resp;
    else if (resp && typeof resp === 'object') normalizedArray = resp.filters || resp.items || resp.data || [resp];
    const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('filterId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for get');
    const resp = await makeRequest(instance, 'GET', `/projects/filters/${id}`, {}, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('filterId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for delete');
    await makeRequest(instance, 'DELETE', `/projects/filters/${id}`, {}, {});
    returnData.push({ json: { success: true, id } });
  }
  return [returnData];
}

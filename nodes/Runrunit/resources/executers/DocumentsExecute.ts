import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Documents');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const payload = safeParseJSON(instance, 'documentObject', i) as any;
    const resp = await makeRequest(instance, 'POST', '/documents', { document: payload });
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('documentId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for update');
    const payload = safeParseJSON(instance, 'documentObject', i) as any;
    const resp = await makeRequest(instance, 'PUT', `/documents/${id}`, { document: payload });
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('documentId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for get');
    const resp = await makeRequest(instance, 'GET', `/documents/${id}`, {}, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  for (let i = 0; i < inputCount; i++) {
    const qs: Record<string, any> = {};
    const returnAll = instance.getNodeParameter('returnAll', i) as boolean;
    if (returnAll) qs.limit = 99000;
    else { qs.limit = instance.getNodeParameter('limit', i, 50); qs.page = instance.getNodeParameter('page', i, 1); }
    const resp = await makeRequest(instance, 'GET', '/documents', {}, qs);
    let normalizedArray: any[] = [];
    if (Array.isArray(resp)) normalizedArray = resp;
    else if (resp && typeof resp === 'object') normalizedArray = resp.documents || resp.data || resp.items || [resp];
    const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

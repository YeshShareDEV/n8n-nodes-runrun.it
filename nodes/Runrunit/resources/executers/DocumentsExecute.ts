import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  if (operation === 'delete') return await handleDelete(instance);
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
  const inputData = instance.getInputData();

  // Build list of taskIds (or single empty) to query. Dedupe to avoid identical requests.
  const taskIdSet = new Set<string>();
  const requests: { taskId?: string; index: number }[] = [];

  if (inputData.length === 0) {
    const taskId = instance.getNodeParameter('taskId', 0, '') as string;
    requests.push({ taskId: taskId || undefined, index: 0 });
  } else {
    for (let i = 0; i < inputData.length; i++) {
      const taskId = instance.getNodeParameter('taskId', i, '') as string;
      const key = taskId || '__noTaskId__';
      if (!taskIdSet.has(key)) {
        taskIdSet.add(key);
        requests.push({ taskId: taskId || undefined, index: i });
      }
    }
  }

  for (const req of requests) {
    const qs: Record<string, any> = {};
    const returnAll = instance.getNodeParameter('returnAll', req.index) as boolean;
    if (returnAll) qs.limit = 99000;
    else { qs.limit = instance.getNodeParameter('limit', req.index, 50); qs.page = instance.getNodeParameter('page', req.index, 1); }

    const path = req.taskId ? `/tasks/${req.taskId}/documents` : '/documents';
    const resp = await makeRequest(instance, 'GET', path, {}, qs);
    let normalizedArray: any[] = [];
    if (Array.isArray(resp)) normalizedArray = resp;
    else if (resp && typeof resp === 'object') normalizedArray = resp.documents || resp.data || resp.items || [resp];
    const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
    const finalItems = await applyPostFilters(instance, items, req.index);
    for (const it of finalItems) returnData.push(it);
  }

  return [returnData];
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('documentId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for delete');
    // API expects DELETE /documents/:id with optional empty body
    const resp = await makeRequest(instance, 'DELETE', `/documents/${id}`, {}, {});
    // API may return 204 No Content; normalize to an object indicating success
    if (resp === undefined || resp === null) returnData.push({ json: { success: true, documentId: id } });
    else returnData.push({ json: resp });
  }
  return [returnData];
}

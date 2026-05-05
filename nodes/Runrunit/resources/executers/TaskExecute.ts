import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';
export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Task');
}
async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const path = '/tasks';
  const taskPayload = safeParseJSON(instance, 'taskObject', 0) as any;
  const body = { task: taskPayload };
  const resp = await makeRequest(instance, 'POST', path, body);
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}
async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const taskId = instance.getNodeParameter('taskId', 0) as string;
  if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for update');
  const path = `/tasks/${taskId}`;
  const taskPayload = safeParseJSON(instance, 'taskObject', 0) as any;
  const body = { task: taskPayload };
  const resp = await makeRequest(instance, 'PUT', path, body);
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}
async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const taskId = instance.getNodeParameter('taskId', 0) as string;
  if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for get');
  const path = `/tasks/${taskId}`;
  const resp = await makeRequest(instance, 'GET', path, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}
async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  // Build qs from first input and make a single request
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else {
    qs.limit = instance.getNodeParameter('limit', 0, 50);
    qs.page = instance.getNodeParameter('page', 0, 1);
  }
  const search = instance.getNodeParameter('search_term', 0, '') as string;
  if (search) qs.search_term = search;
  const projectId = instance.getNodeParameter('project_id', 0, 0) as number;
  if (projectId !== 0) qs.project_id = projectId;
  const responsibleId = instance.getNodeParameter('responsible_id', 0, '') as string;
  if (responsibleId) qs.responsible_id = responsibleId;
  const clientId = instance.getNodeParameter('client_id', 0, 0) as number;
  if (clientId !== 0) qs.client_id = clientId;
  const isClosed = instance.getNodeParameter('is_closed', 0, 'all') as string;
  if (isClosed !== 'all') {
    qs.is_closed = isClosed;
  } else {
    qs.bypass_status_default = true;
  }
  const resp = await makeRequest(instance, 'GET', '/tasks', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.tasks || resp.data || resp.items || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  // For each original input, apply post-filters using its index (filters/options remain per-item)
  for (let i = 0; i < inputCount; i++) {
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

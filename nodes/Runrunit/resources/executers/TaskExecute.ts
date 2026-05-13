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
  const path = '/tasks';
  const taskPayload = safeParseJSON(instance, 'taskObject', 0) as any;
  const body = { task: taskPayload };
  const resp = await makeRequest(instance, 'POST', path, body);
  return [[{ json: resp }]];
}
async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const taskId = instance.getNodeParameter('taskId', 0) as string;
  if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for update');
  const path = `/tasks/${taskId}`;
  const taskPayload = safeParseJSON(instance, 'taskObject', 0) as any;
  const body = { task: taskPayload };
  const resp = await makeRequest(instance, 'PUT', path, body);
  return [[{ json: resp }]];
}
async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const taskId = instance.getNodeParameter('taskId', 0) as string;
  if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for get');
  const path = `/tasks/${taskId}`;
  const resp = await makeRequest(instance, 'GET', path, {}, {});
  return [[{ json: resp }]];
}
async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // Build qs from first input and make a single request
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  let currentPage: number;
  if (returnAll) {
    qs.limit = 99000;
    currentPage = 1;
  } else {
    qs.limit = instance.getNodeParameter('limit', 0, 50);
    currentPage = instance.getNodeParameter('page', 0, 1) as number;
    qs.page = currentPage;
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
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  const resp = await makeRequest(instance, 'GET', '/tasks', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.tasks || resp.data || resp.items || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  const filters = instance.getNodeParameter('filters', 0, {}) as any;
  const hasFilters = !!(filters?.filter?.length > 0);
  const finalItems = (hasFilters && items.length > 0) ? await applyPostFilters(instance, items, 0) : items;
  const finalData = finalItems.map(item => item.json);
  const count = finalData.length;
  return [[{
    json: {
      data: finalData,
      metadata: {
        count,
        has_more_useful_data: count > 0,
        page: currentPage,
      },
    },
  }]];
}

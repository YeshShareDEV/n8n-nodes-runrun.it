import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Team');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const payload = safeParseJSON(instance, 'teamObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/teams', { team: payload });
  return [[{ json: resp }]];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('teamId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Team ID required for update');
  const payload = safeParseJSON(instance, 'teamObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/teams/${id}`, { team: payload });
  return [[{ json: resp }]];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('teamId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Team ID required for get');
  const resp = await makeRequest(instance, 'GET', `/teams/${id}`, {}, {});
  return [[{ json: resp }]];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else { qs.limit = instance.getNodeParameter('limit', 0, 50); qs.page = instance.getNodeParameter('page', 0, 1); }
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  const resp = await makeRequest(instance, 'GET', '/teams', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.teams || resp.data || resp.items || [resp];
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

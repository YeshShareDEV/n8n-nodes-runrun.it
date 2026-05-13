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
  const path = '/users';
  const userPayload = safeParseJSON(instance, 'userObject', 0) as any;
  const body = { user: userPayload, make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', 0) };
  const resp = await makeRequest(instance, 'POST', path, body);
  return [[{ json: resp }]];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const userId = instance.getNodeParameter('userId', 0) as string;
  if (!userId) throw new NodeOperationError(instance.getNode(), 'User ID is required for update');
  const path = `/users/${userId}`;
  const userPayload = safeParseJSON(instance, 'userObject', 0) as any;
  const body = { user: userPayload, make_everybody_mutual_partners: instance.getNodeParameter('makeEverybodyMutualPartners', 0) };
  const resp = await makeRequest(instance, 'PUT', path, body);
  return [[{ json: resp }]];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const userId = instance.getNodeParameter('userId', 0) as string;
  if (!userId) throw new NodeOperationError(instance.getNode(), 'User ID is required for get');
  const path = `/users/${userId}`;
  const resp = await makeRequest(instance, 'GET', path, {}, {});
  return [[{ json: resp }]];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
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
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  const resp = await makeRequest(instance, 'GET', '/users', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.users || resp.data || resp.items || [resp];
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

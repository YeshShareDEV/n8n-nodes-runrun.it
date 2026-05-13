import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Checklists');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const payload = safeParseJSON(instance, 'checklistObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/checklists', { checklist: payload });
  return [[{ json: resp }]];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('checklistId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Checklist ID required for update');
  const payload = safeParseJSON(instance, 'checklistObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/checklists/${id}`, { checklist: payload });
  return [[{ json: resp }]];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('checklistId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Checklist ID required for get');
  const resp = await makeRequest(instance, 'GET', `/checklists/${id}`, {}, {});
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
  const resp = await makeRequest(instance, 'GET', '/checklists', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.checklists || resp.data || resp.items || [resp];
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

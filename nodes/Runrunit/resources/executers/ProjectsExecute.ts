import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'getAll') return await handleGetAllProjects(instance);
  if (operation === 'get') return await handleGetProject(instance);
  if (operation === 'create') return await handleCreateProject(instance);
  if (operation === 'update') return await handleUpdateProject(instance);
  if (operation === 'related_users') return await handleRelatedUsers(instance);
  if (operation === 'move') return await handleMove(instance);
  if (operation === 'share') return await handleShare(instance);
  if (operation === 'unshare') return await handleUnshare(instance);
  if (operation === 'clone') return await handleClone(instance);
  if (operation === 'change_board_stage') return await handleChangeBoardStage(instance);
  if (operation === 'getAll_filters') return await handleGetAllFilters(instance);
  if (operation === 'get_filter') return await handleGetFilter(instance);
  if (operation === 'delete_filter') return await handleDeleteFilter(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Projects');
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
  const resp = await makeRequest(instance, 'GET', '/projects/filters', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.filters || resp.items || resp.data || [resp];
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

async function handleGetAllProjects(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
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
  const clientId = instance.getNodeParameter('client_id', 0, 0) as number | null | undefined;
  if (clientId !== null && typeof clientId !== 'undefined' && clientId !== 0) qs.client_id = clientId;
  const projectGroupId = instance.getNodeParameter('project_group_id', 0, 0) as number | null | undefined;
  if (projectGroupId !== null && typeof projectGroupId !== 'undefined' && projectGroupId !== 0) qs.project_group_id = projectGroupId;
  const isClosed = instance.getNodeParameter('is_closed', 0, 'all') as string;
  if (isClosed !== 'all') {
    qs.is_closed = isClosed;
  } else {
    qs.bypass_status_default = true;
  }
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  const resp = await makeRequest(instance, 'GET', '/projects', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.projects || resp.items || resp.data || [resp];
  // Map project `name` to `project_name` so post-filters that expect `project_name` work
  for (const obj of normalizedArray) {
    if (obj && typeof obj === 'object') {
      if (obj.name && typeof obj.project_name === 'undefined') obj.project_name = obj.name;
    }
  }
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

async function handleGetProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for get');
  const resp = await makeRequest(instance, 'GET', `/projects/${id}`, {}, {});
  return [[{ json: resp }]];
}

async function handleCreateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const payload = safeParseJSON(instance, 'projectObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/projects', { project: payload });
  return [[{ json: resp }]];
}

async function handleUpdateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for update');
  const payload = safeParseJSON(instance, 'projectObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/projects/${id}`, payload, {});
  return [[{ json: resp }]];
}

async function handleRelatedUsers(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for related_users');
  const resp = await makeRequest(instance, 'GET', `/projects/${id}/related_users`, {}, {});
  const items: INodeExecutionData[] = Array.isArray(resp) ? resp.map((r: any) => ({ json: r })) : [{ json: resp }];
  return [items];
}

async function handleMove(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for move');
  const payload = safeParseJSON(instance, 'moveObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/move`, payload, {});
  return [[{ json: resp }]];
}

async function handleShare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for share');
  const payload = safeParseJSON(instance, 'shareObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/share`, payload, {});
  return [[{ json: resp }]];
}

async function handleUnshare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for unshare');
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/unshare`, {}, {});
  return [[{ json: resp }]];
}

async function handleClone(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for clone');
  const payload = safeParseJSON(instance, 'cloneObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/clone`, payload, {});
  return [[{ json: resp }]];
}

async function handleChangeBoardStage(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for change_board_stage');
  const payload = safeParseJSON(instance, 'changeBoardStageObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/change_board_stage`, payload, {});
  return [[{ json: resp }]];
}

async function handleGetAllFilters(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  return await handleGetAll(instance);
}

async function handleGetFilter(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  return await handleGet(instance);
}

async function handleDeleteFilter(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  return await handleDelete(instance);
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('filterId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for get');
  const resp = await makeRequest(instance, 'GET', `/projects/filters/${id}`, {}, {});
  return [[{ json: resp }]];
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('filterId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for delete');
  await makeRequest(instance, 'DELETE', `/projects/filters/${id}`, {}, {});
  return [[{ json: { success: true, id } }]];
}

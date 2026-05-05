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
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else { qs.limit = instance.getNodeParameter('limit', 0, 50); qs.page = instance.getNodeParameter('page', 0, 1); }
  const resp = await makeRequest(instance, 'GET', '/projects/filters', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.filters || resp.items || resp.data || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  for (let i = 0; i < inputCount; i++) {
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

async function handleGetAllProjects(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  const qs: Record<string, any> = {};
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  if (returnAll) qs.limit = 99000;
  else { qs.limit = instance.getNodeParameter('limit', 0, 50); qs.page = instance.getNodeParameter('page', 0, 1); }
  const clientId = instance.getNodeParameter('client_id', 0, 0) as number;
  if (clientId !== 0) qs.client_id = clientId;
  const projectGroupId = instance.getNodeParameter('project_group_id', 0, 0) as number;
  if (projectGroupId !== 0) qs.project_group_id = projectGroupId;
  const resp = await makeRequest(instance, 'GET', '/projects', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.projects || resp.items || resp.data || [resp];
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  for (let i = 0; i < inputCount; i++) {
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

async function handleGetProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for get');
  const resp = await makeRequest(instance, 'GET', `/projects/${id}`, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleCreateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const payload = safeParseJSON(instance, 'projectObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', '/projects', { project: payload });
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleUpdateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for update');
  const payload = safeParseJSON(instance, 'projectObject', 0) as any;
  const resp = await makeRequest(instance, 'PUT', `/projects/${id}`, payload, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleRelatedUsers(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for related_users');
  const resp = await makeRequest(instance, 'GET', `/projects/${id}/related_users`, {}, {});
  const items: INodeExecutionData[] = Array.isArray(resp) ? resp.map((r: any) => ({ json: r })) : [{ json: resp }];
  for (const it of items) returnData.push(it);
  return [returnData];
}

async function handleMove(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for move');
  const payload = safeParseJSON(instance, 'moveObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/move`, payload, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleShare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for share');
  const payload = safeParseJSON(instance, 'shareObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/share`, payload, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleUnshare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for unshare');
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/unshare`, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleClone(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for clone');
  const payload = safeParseJSON(instance, 'cloneObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/clone`, payload, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleChangeBoardStage(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('projectId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for change_board_stage');
  const payload = safeParseJSON(instance, 'changeBoardStageObject', 0) as any;
  const resp = await makeRequest(instance, 'POST', `/projects/${id}/change_board_stage`, payload, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
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
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('filterId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for get');
  const resp = await makeRequest(instance, 'GET', `/projects/filters/${id}`, {}, {});
  for (let i = 0; i < inputData.length; i++) returnData.push({ json: resp });
  return [returnData];
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  if (inputData.length === 0) return [returnData];
  const id = instance.getNodeParameter('filterId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Filter ID required for delete');
  await makeRequest(instance, 'DELETE', `/projects/filters/${id}`, {}, {});
  returnData.push({ json: { success: true, id } });
  return [returnData];
}

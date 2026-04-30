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

async function handleGetAllProjects(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputCount = Math.max(1, instance.getInputData().length);
  for (let i = 0; i < inputCount; i++) {
    const qs: Record<string, any> = {};
    const returnAll = instance.getNodeParameter('returnAll', i) as boolean;
    if (returnAll) qs.limit = 1000;
    else { qs.limit = instance.getNodeParameter('limit', i, 50); qs.page = instance.getNodeParameter('page', i, 1); }
    const resp = await makeRequest(instance, 'GET', '/projects', {}, qs);
    let normalizedArray: any[] = [];
    if (Array.isArray(resp)) normalizedArray = resp;
    else if (resp && typeof resp === 'object') normalizedArray = resp.projects || resp.items || resp.data || [resp];
    const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
    const finalItems = await applyPostFilters(instance, items, i);
    for (const it of finalItems) returnData.push(it);
  }
  return [returnData];
}

async function handleGetProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for get');
    const resp = await makeRequest(instance, 'GET', `/projects/${id}`, {}, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleCreateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const payload = safeParseJSON(instance, 'projectObject', i) as any;
    const resp = await makeRequest(instance, 'POST', '/projects', { project: payload });
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleUpdateProject(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for update');
    const payload = safeParseJSON(instance, 'projectObject', i) as any;
    const resp = await makeRequest(instance, 'PUT', `/projects/${id}`, payload, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleRelatedUsers(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for related_users');
    const resp = await makeRequest(instance, 'GET', `/projects/${id}/related_users`, {}, {});
    const items: INodeExecutionData[] = Array.isArray(resp) ? resp.map((r: any) => ({ json: r })) : [{ json: resp }];
    for (const it of items) returnData.push(it);
  }
  return [returnData];
}

async function handleMove(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for move');
    const payload = safeParseJSON(instance, 'moveObject', i) as any;
    const resp = await makeRequest(instance, 'POST', `/projects/${id}/move`, payload, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleShare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for share');
    const payload = safeParseJSON(instance, 'shareObject', i) as any;
    const resp = await makeRequest(instance, 'POST', `/projects/${id}/share`, payload, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleUnshare(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for unshare');
    const resp = await makeRequest(instance, 'POST', `/projects/${id}/unshare`, {}, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleClone(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for clone');
    const payload = safeParseJSON(instance, 'cloneObject', i) as any;
    const resp = await makeRequest(instance, 'POST', `/projects/${id}/clone`, payload, {});
    returnData.push({ json: resp });
  }
  return [returnData];
}

async function handleChangeBoardStage(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();
  for (let i = 0; i < inputData.length; i++) {
    const id = instance.getNodeParameter('projectId', i) as string;
    if (!id) throw new NodeOperationError(instance.getNode(), 'Project ID required for change_board_stage');
    const payload = safeParseJSON(instance, 'changeBoardStageObject', i) as any;
    const resp = await makeRequest(instance, 'POST', `/projects/${id}/change_board_stage`, payload, {});
    returnData.push({ json: resp });
  }
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

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

  for (let i = 0; i < inputData.length; i++) {
    const path = '/tasks';
    const taskPayload = safeParseJSON(instance, 'taskObject', i) as any;
    const body = { task: taskPayload };
    const resp = await makeRequest(instance, 'POST', path, body);
    returnData.push({ json: resp });
  }

  return [returnData];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();

  for (let i = 0; i < inputData.length; i++) {
    const taskId = instance.getNodeParameter('taskId', i) as string;
    if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for update');
    const path = `/tasks/${taskId}`;
    const taskPayload = safeParseJSON(instance, 'taskObject', i) as any;
    const body = { task: taskPayload };
    const resp = await makeRequest(instance, 'PUT', path, body);
    returnData.push({ json: resp });
  }

  return [returnData];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const inputData = instance.getInputData();

  for (let i = 0; i < inputData.length; i++) {
    const taskId = instance.getNodeParameter('taskId', i) as string;
    if (!taskId) throw new NodeOperationError(instance.getNode(), 'Task ID is required for get');
    const path = `/tasks/${taskId}`;
    const resp = await makeRequest(instance, 'GET', path, {}, {});
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
    if (returnAll) qs.limit = 1000;
    else {
      qs.limit = instance.getNodeParameter('limit', i, 50);
      qs.page = instance.getNodeParameter('page', i, 1);
    }

    const search = instance.getNodeParameter('search_term', i, '') as string;
    if (search) qs.search_term = search;

    const projectId = instance.getNodeParameter('project_id', i, 0) as number;
    if (projectId !== 0) qs.project_id = projectId;

    const responsibleId = instance.getNodeParameter('responsible_id', i, '') as string;
    if (responsibleId) qs.responsible_id = responsibleId;

    const isClosed = instance.getNodeParameter('is_closed', i, 'all') as string;
    if (isClosed !== 'all') qs.is_closed = isClosed;

    const resp = await makeRequest(instance, 'GET', '/tasks', {}, qs);

    let normalizedArray: any[] = [];
    if (Array.isArray(resp)) normalizedArray = resp;
    else if (resp && typeof resp === 'object') {
      normalizedArray = resp.tasks || resp.data || resp.items || [resp];
    }

    const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));

    // apply generic post-filters
    const finalItems = await applyPostFilters(instance, items, i);

    for (const it of finalItems) returnData.push(it);
  }

  return [returnData];
}

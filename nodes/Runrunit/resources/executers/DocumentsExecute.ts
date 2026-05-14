import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  if (operation === 'delete') return await handleDelete(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Documents');
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // 1. Pegamos o ID da interface (índice 0, pois é um parâmetro fixo do nó)
  const id = instance.getNodeParameter('documentId', 0) as string;
  if (!id) {
    throw new NodeOperationError(instance.getNode(), 'Document ID required for get');
  }
  // 2. A chamada de API acontece FORA de qualquer loop
  const resp = await makeRequest(instance, 'GET', `/documents/${id}`, {}, {});
  // 3. Retorna apenas um resultado
  return [[{ json: resp }]];
}

async function handleGetAll(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const taskId = instance.getNodeParameter('taskId', 0, '') as string;
  const qs: Record<string, any> = {};
  qs.limit = instance.getNodeParameter('limit', 0, 50);
  const currentPage = instance.getNodeParameter('page', 0, 1) as number;
  qs.page = currentPage;
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  const path = taskId ? `/tasks/${taskId}/documents` : '/documents';
  const resp = await makeRequest(instance, 'GET', path, {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) {
    normalizedArray = resp;
  } else if (resp && typeof resp === 'object') {
    normalizedArray = resp.documents || resp.data || resp.items || [resp];
  }
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  const finalItems = await applyPostFilters(instance, items, 0);
  const finalData = finalItems.map(item => item.json);
  const count = finalData.length;
  if (count > 0) {
    return [finalData.map((item: any) => ({ json: item }))];
  } else {
    return [[{ json: {} }]];
  }
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('documentId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for delete');
  const resp = await makeRequest(instance, 'DELETE', `/documents/${id}`, {}, {});
  const json = (resp === undefined || resp === null) ? { success: true, documentId: id } : resp;
  return [[{ json }]];
}

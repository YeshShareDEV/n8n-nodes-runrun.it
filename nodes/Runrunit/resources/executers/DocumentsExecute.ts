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
  //const inputData = instance.getInputData();
  // 1. EXTRAÇÃO DE PARÂMETROS (Uma única vez, ignorando o loop de entrada)
  // Usamos o índice 0 porque queremos o que o usuário configurou na interface do nó.
  const taskId = instance.getNodeParameter('taskId', 0, '') as string;
  const returnAll = instance.getNodeParameter('returnAll', 0) as boolean;
  const qs: Record<string, any> = {};
  // MANTENDO OS VALORES ORIGINAIS QUE VOCÊ DEFINIU
  if (returnAll) {
    qs.limit = 99000;
  } else {
    qs.limit = instance.getNodeParameter('limit', 0, 50);
    qs.page = instance.getNodeParameter('page', 0, 1);
  }
  const sort = instance.getNodeParameter('sort', 0, '') as string;
  if (sort) { qs.sort = sort; qs.sort_dir = instance.getNodeParameter('sort_dir', 0, 'asc') as string; }
  // 2. MONTAGEM DO PATH (Fiel à interface index.ts)
  const path = taskId ? `/tasks/${taskId}/documents` : '/documents';
  // 3. A CHAMADA ÚNICA (FORA DO LOOP)
  const resp = await makeRequest(instance, 'GET', path, {}, qs);
  // 4. NORMALIZAÇÃO DOS DADOS (Sua lógica de tratamento de array)
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) {
    normalizedArray = resp;
  } else if (resp && typeof resp === 'object') {
    normalizedArray = resp.documents || resp.data || resp.items || [resp];
  }
  const items: INodeExecutionData[] = normalizedArray.map((obj: any) => ({ json: obj }));
  // 5. FILTROS POST-EXECUÇÃO
  const finalItems = await applyPostFilters(instance, items, 0);
  return [finalItems];
}

async function handleDelete(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('documentId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for delete');
  const resp = await makeRequest(instance, 'DELETE', `/documents/${id}`, {}, {});
  const json = (resp === undefined || resp === null) ? { success: true, documentId: id } : resp;
  return [[{ json }]];
}

import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters, safeParseJSON } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  if (operation === 'delete') return await handleDelete(instance);
  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Documents');
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // 1. Pegamos a configuração da interface (índice 0 é o padrão para parâmetros fixos)
  const taskId = instance.getNodeParameter('taskId', 0) as string;
  const payload = safeParseJSON(instance, 'documentObject', 0) as any;
  // 2. A EXECUÇÃO FICA FORA DE QUALQUER LOOP
  // Isso garante que, não importa quantos itens entrem, apenas UM documento seja criado.
  const resp = await makeRequest(instance, 'POST', `/tasks/${taskId}/documents`, { document: payload });
  // 3. Retornamos o resultado como um item único
  return [[{ json: resp }]];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // 1. Pegamos os parâmetros na interface (índice 0)
  const id = instance.getNodeParameter('documentId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for update');
  const payload = safeParseJSON(instance, 'documentObject', 0) as any;

  // 2. Executamos UMA única requisição PUT (fora de qualquer loop)
  const resp = await makeRequest(instance, 'PUT', `/documents/${id}`, { document: payload });

  // 3. Retornamos um único item
  return [[{ json: resp }]];
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
  const inputData = instance.getInputData();
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
  const returnData: INodeExecutionData[] = [];
    // single documentId expected (either from incoming item 0 or node parameter)
  const idx = 0;
  const id = instance.getNodeParameter('documentId', idx) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Document ID required for delete');
  // single request
  const resp = await makeRequest(instance, 'DELETE', `/documents/${id}`, {}, {});
  if (resp === undefined || resp === null) returnData.push({ json: { success: true, documentId: id } });
  else returnData.push({ json: resp });
  return [returnData];
}

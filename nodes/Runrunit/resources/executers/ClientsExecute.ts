import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { makeRequest, applyPostFilters } from '../../GenericFunctions';

export async function execute(instance: IExecuteFunctions, operation: string): Promise<INodeExecutionData[][]> {
  if (operation === 'create') return await handleCreate(instance);
  if (operation === 'update') return await handleUpdate(instance);
  if (operation === 'get') return await handleGet(instance);
  if (operation === 'getAll') return await handleGetAll(instance);
  if (operation === 'monthly_budgets') return await handleMonthlyBudgets(instance);
  if (operation === 'update_monthly_budget') return await handleUpdateMonthlyBudget(instance);

  throw new NodeOperationError(instance.getNode(), 'Operation not supported for Clients');
}

function buildClientPayload(instance: IExecuteFunctions): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const name = instance.getNodeParameter('clientName', 0, '') as string;
  const isVisible = instance.getNodeParameter('clientIsVisible', 0, true) as boolean;
  const budgetedHours = instance.getNodeParameter('clientBudgetedHoursMonth', 0, 0) as number;
  const budgetedCost = instance.getNodeParameter('clientBudgetedCostMonth', 0, 0) as number;
  const customField = instance.getNodeParameter('clientCustomField', 0, '') as string;
  if (name) payload.name = name;
  payload.is_visible = isVisible;
  if (budgetedHours) payload.budgeted_hours_month = budgetedHours;
  if (budgetedCost) payload.budgeted_cost_month = budgetedCost;
  if (customField) payload.custom_field = customField;
  return payload;
}

async function handleCreate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const payload = buildClientPayload(instance);
  const resp = await makeRequest(instance, 'POST', '/clients', { client: payload });
  return [[{ json: resp }]];
}

async function handleUpdate(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for update');
  const payload = buildClientPayload(instance);
  const resp = await makeRequest(instance, 'PUT', `/clients/${id}`, { client: payload });
  return [[{ json: resp }]];
}

async function handleMonthlyBudgets(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for monthly_budgets');
  const qs: Record<string, unknown> = {};
  const month = instance.getNodeParameter('month', 0, '') as string;
  const time = instance.getNodeParameter('time', 0, 0) as number;
  const cost = instance.getNodeParameter('cost', 0, '') as string;
  if (month) qs.month = month;
  if (time) qs.time = time;
  if (cost) qs.cost = cost;
  const resp = await makeRequest(instance, 'GET', `/clients/${id}/monthly_budgets`, {}, qs);
  return [[{ json: resp }]];
}

async function handleUpdateMonthlyBudget(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for update_monthly_budget');
  const budgetObject = instance.getNodeParameter('budgetObject', 0, '{}') as string;
  const payload = typeof budgetObject === 'string' ? JSON.parse(budgetObject) : budgetObject;
  const resp = await makeRequest(instance, 'POST', `/clients/${id}/update_monthly_budget`, { monthly_budget: payload });
  return [[{ json: resp }]];
}

async function handleGet(instance: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const id = instance.getNodeParameter('clientId', 0) as string;
  if (!id) throw new NodeOperationError(instance.getNode(), 'Client ID required for get');
  const resp = await makeRequest(instance, 'GET', `/clients/${id}`, {}, {});
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
  const resp = await makeRequest(instance, 'GET', '/clients', {}, qs);
  let normalizedArray: any[] = [];
  if (Array.isArray(resp)) normalizedArray = resp;
  else if (resp && typeof resp === 'object') normalizedArray = resp.clients || resp.data || resp.items || [resp];
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

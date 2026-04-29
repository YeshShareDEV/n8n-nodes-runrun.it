import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';

export async function makeRequest(
  instance: IExecuteFunctions,
  method: string,
  path: string,
  body: any = {},
  qs: Record<string, any> = {},
): Promise<any> {
  const creds = (await instance.getCredentials?.('runrunitApi')) as { appKey?: string; userToken?: string } | undefined;
  if (!creds) throw new NodeOperationError(instance.getNode(), 'Credentials `runrunitApi` are not set');

  const appKey = creds.appKey || '';
  const userToken = creds.userToken || '';
  const baseURL = 'https://runrun.it/api/v1.0';
  const mode = instance.getNodeParameter('mode', 0) as string;

  let url = `${baseURL}${path}`;
  if (qs && Object.keys(qs).length) {
    const params = new URLSearchParams();
    for (const k of Object.keys(qs)) params.append(k, String(qs[k]));
    url += `?${params.toString()}`;
  }

  if (mode === 'preview') {
    if (method.toUpperCase() === 'GET') {
      return { curl: `curl --location '${url}' --header 'App-Key: ${appKey}' --header 'User-Token: ${userToken}'` };
    }
    const bodyString = JSON.stringify(body).replace(/'/g, "'\"'\"'");
    return { curl: `curl --location '${url}' --header 'App-Key: ${appKey}' --header 'User-Token: ${userToken}' --header 'Content-Type: application/json' --data-raw '${bodyString}'` };
  }

  try {
    const opts: any = { method, url, headers: { 'App-Key': appKey, 'User-Token': userToken }, json: true };
    if (method.toUpperCase() !== 'GET') {
      opts.body = body;
      opts.headers['Content-Type'] = 'application/json';
    }
    return await instance.helpers.httpRequest(opts);
  } catch (error: any) {
    const apiErrorMessage = error?.response?.body?.message || error?.message || 'Unknown error';
    throw new NodeOperationError(instance.getNode(), `Erro Runrunit: "${apiErrorMessage}"`, { itemIndex: 0 });
  }
}

export async function applyPostFilters(
  instance: IExecuteFunctions,
  items: INodeExecutionData[],
  itemIndex = 0,
): Promise<INodeExecutionData[]> {
  // Work on a deep clone of items to avoid side effects
  const postItems: INodeExecutionData[] = items.map((it) => ({ json: JSON.parse(JSON.stringify(it.json)), binary: it.binary ? { ...it.binary } : undefined }));

  // Read conditions and UI options safely
  let rawConditions: any = {};
  let uiOptions: any = {};
  try {
    rawConditions = instance.getNodeParameter('conditions', itemIndex) as any || {};
  } catch (e) {
    rawConditions = {};
  }
  try {
    uiOptions = instance.getNodeParameter('options', itemIndex) as any || {};
  } catch (e) {
    uiOptions = {};
  }

  const providedConditions = rawConditions.conditions ?? rawConditions.filter ?? rawConditions;
  const hasConditions = providedConditions && ((Array.isArray(providedConditions) && providedConditions.length > 0) || (typeof providedConditions === 'object' && Object.keys(providedConditions).length > 0));

  let finalItems: INodeExecutionData[] = postItems;

  if (hasConditions) {
    try {
      const filterHelper = (instance.helpers as any)?.filterInputData;
      if (typeof filterHelper === 'function') {
        if (!rawConditions.filter) rawConditions.filter = {};
        if (typeof rawConditions.filter.caseSensitive === 'undefined') rawConditions.filter.caseSensitive = !uiOptions.ignoreCase;
        if (typeof rawConditions.filter.typeValidation === 'undefined') rawConditions.filter.typeValidation = uiOptions.looseTypeValidation ? 'loose' : 'strict';

        const payload = {
          conditions: providedConditions,
          combinator: rawConditions.combinator ?? 'and',
          options: {
            caseSensitive: !!rawConditions.filter.caseSensitive,
            typeValidation: rawConditions.filter.typeValidation,
          },
        };

        const result = await (filterHelper as any).call(instance, postItems, payload);
        if (Array.isArray(result)) finalItems = result;
        else if (result && Array.isArray(result.filteredItems)) finalItems = result.filteredItems;
      }
    } catch (err: any) {
      // do not break execution on filter errors
      // eslint-disable-next-line no-console
      console.error('Runrunit: erro ao aplicar post-filter conditions:', err?.message ?? err);
      finalItems = postItems;
    }
  } else {
    // Fallback to fixedCollection `filters` if present
    const filtersCollection = ((): { filter?: Array<{ field: string; operator: string; value: string }> } => {
      try {
        return instance.getNodeParameter('filters', itemIndex) as any;
      } catch (e) {
        return { filter: [] };
      }
    })();
    const filters = filtersCollection?.filter ?? [];

    if (filters.length > 0) {
      finalItems = postItems.filter((item) => {
        const json = item.json as Record<string, any>;

        return filters.every((f) => {
          const itemValue = json[f.field];
          const filterValue = f.value;

          if (f.operator === 'equals') return String(itemValue) === String(filterValue);
          if (f.operator === 'contains') return String(itemValue).includes(filterValue);
          if (f.operator === 'gt') return Number(itemValue) > Number(filterValue);
          if (f.operator === 'lt') return Number(itemValue) < Number(filterValue);
          if (f.operator === 'isTrue') return itemValue === true || itemValue === 'true';
          if (f.operator === 'isFalse') return itemValue === false || itemValue === 'false';
          return true;
        });
      });
    }
  }

  return finalItems;
}

export function safeParseJSON(instance: IExecuteFunctions, paramName: string, itemIndex = 0): any {
  const val = instance.getNodeParameter(paramName, itemIndex) as any;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      throw new NodeOperationError(instance.getNode(), `${paramName} inválido`);
    }
  }
  return val;
}

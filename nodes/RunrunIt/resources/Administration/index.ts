import type { INodeProperties } from 'n8n-workflow';
import { administrationGetDescription } from './get';
import { administrationCreateDescription } from './create';
import { administrationUpdateDescription } from './update';
import { administrationDeleteDescription } from './delete';
import { administrationOptionsDescription } from './options';

const showOnlyForAdministration = { resource: ['Administration'] };

export const administrationDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: showOnlyForAdministration },
        options: [
            { name: 'Get', value: 'get', action: 'Get an item' },
            { name: 'Create', value: 'create', action: 'Create an item' },
            { name: 'Update', value: 'update', action: 'Update an item' },
            { name: 'Delete', value: 'delete', action: 'Delete an item' },
        ],
        default: 'get',
    },
    {
        displayName: 'Item ID',
        name: 'itemid',
        type: 'number',
        placeholder: 'Deixe vazio para listar todos',
        typeOptions: { minValue: 1 },
        displayOptions: { show: { operation: ['get', 'update', 'delete'], resource: ['Administration'] } },
        description: 'ID do item quando aplicável',
        default: 0,
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: { show: { operation: ['get'], resource: ['Administration'] } },
        default: false,
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Administration'] } },
        description: 'Limite de itens retornados quando Return All for false',
    },
    
    ...administrationGetDescription,
    ...administrationCreateDescription,
    ...administrationUpdateDescription,
    ...administrationDeleteDescription,
    ...administrationOptionsDescription,
];

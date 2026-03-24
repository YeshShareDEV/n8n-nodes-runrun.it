import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'List', value: 'list', description: 'Get a list of tasks' },
      { name: 'Get', value: 'get', description: 'Get a task by ID' },
      { name: 'Create', value: 'create', description: 'Create a task' },
      { name: 'Update', value: 'update', description: 'Update a task' },
      { name: 'Delete', value: 'delete', description: 'Delete a task' },
      { name: 'Play', value: 'play', description: 'Play a task (start work)' },
      { name: 'Pause', value: 'pause', description: 'Pause a task' },
      { name: 'Deliver', value: 'deliver', description: 'Deliver a task' },
      { name: 'Reopen', value: 'reopen', description: 'Reopen a task' },
      { name: 'Mark as Urgent', value: 'mark_as_urgent', description: 'Mark a task as urgent' },
      { name: 'Move to Next Stage', value: 'move_to_next_stage', description: 'Move task to next board stage' },
      { name: 'Change Board', value: 'change_board', description: 'Change the task board/stage' },
      { name: 'Reestimate', value: 'reestimate', description: 'Update estimated time for a task' },
      // Assignment-specific operations
      { name: 'Assignment: Delete', value: 'assignment_delete', description: 'Delete a task assignment' },
      { name: 'Assignment: Play', value: 'assignment_play', description: 'Play an assignment' },
      { name: 'Assignment: Pause', value: 'assignment_pause', description: 'Pause an assignment' },
      { name: 'Assignment: Deliver', value: 'assignment_deliver', description: 'Deliver an assignment' },
      { name: 'Assignment: Reopen', value: 'assignment_reopen', description: 'Reopen an assignment' },
      { name: 'Assignment: Reposition', value: 'assignment_reposition', description: 'Reposition an assignment' },
      { name: 'Assignment: Reestimate', value: 'assignment_reestimate', description: 'Reestimate an assignment' },
    ],
    default: 'list',
    displayOptions: {
      show: {
        resource: ['task'],
      },
    },
  },
];

export const taskFields: INodeProperties[] = [
  /* ---------- list ---------- */
  {
    displayName: 'Project ID',
    name: 'project_id',
    type: 'number',
    default: 0,
    placeholder: '800',
    description: 'Filter by project id',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },
  {
    displayName: 'Assignee ID',
    name: 'assignee_id',
    type: 'number',
    default: 0,
    description: 'Filter by assignee id',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'Open', value: 'open' },
      { name: 'Closed', value: 'closed' },
    ],
    default: 'open',
    description: 'Filter by status',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },
  {
    displayName: 'Tags (comma separated)',
    name: 'tags',
    type: 'string',
    default: '',
    description: 'Filter by tags',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    description: 'Page number (pagination)',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    description: 'Items per page (max 100)',
    displayOptions: { show: { resource: ['task'], operation: ['list'] } },
  },

  /* ---------- get / delete / simple actions (taskId) ---------- */
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'number',
    default: 0,
    description: 'ID of the task',
    displayOptions: { show: { resource: ['task'], operation: ['get','delete','play','pause','deliver','reopen','mark_as_urgent','move_to_next_stage','change_board','reestimate'] } },
  },

  /* ---------- create ---------- */
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    description: 'Task title',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Project ID (create/update)',
    name: 'project_id',
    type: 'number',
    default: 0,
    description: 'Project id to associate the task with',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Assignee ID',
    name: 'assignee_id',
    type: 'number',
    default: 0,
    description: 'Assign task to user id',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    typeOptions: { alwaysOpenEditWindow: true },
    default: '',
    description: 'Long description or content of the task',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Desired Start Date',
    name: 'desired_start_date',
    type: 'dateTime',
    default: '',
    description: 'Desired start date (ISO 8601)',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Desired Date',
    name: 'desired_date',
    type: 'dateTime',
    default: '',
    description: 'Desired delivery date (ISO 8601)',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Points',
    name: 'points',
    type: 'number',
    default: 0,
    description: 'Scrum points or estimation metric',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },
  {
    displayName: 'Tags (comma separated)',
    name: 'tags_create',
    type: 'string',
    default: '',
    description: 'Tags for the task (comma separated)',
    displayOptions: { show: { resource: ['task'], operation: ['create','update'] } },
  },

  /* ---------- change_board ---------- */
  {
    displayName: 'Board ID',
    name: 'board_id',
    type: 'number',
    default: 0,
    description: 'Target board id when changing board',
    displayOptions: { show: { resource: ['task'], operation: ['change_board'] } },
  },
  {
    displayName: 'Stage ID',
    name: 'stage_id',
    type: 'number',
    default: 0,
    description: 'Target stage id when changing board',
    displayOptions: { show: { resource: ['task'], operation: ['change_board'] } },
  },

  /* ---------- reestimate (task) ---------- */
  {
    displayName: 'Estimated Time (minutes)',
    name: 'estimated_time',
    type: 'number',
    default: 0,
    description: 'Estimated time in minutes for reestimate',
    displayOptions: { show: { resource: ['task'], operation: ['reestimate'] } },
  },

  /* ---------- assignment operations: require taskId + assignmentId ---------- */
  {
    displayName: 'Assignment ID',
    name: 'assignmentId',
    type: 'number',
    default: 0,
    description: 'ID of the assignment (use with assignment operations)',
    displayOptions: { show: { resource: ['task'], operation: ['assignment_delete','assignment_play','assignment_pause','assignment_deliver','assignment_reopen','assignment_reposition','assignment_reestimate'] } },
  },
  {
    displayName: 'Position (reposition)',
    name: 'position',
    type: 'number',
    default: 1,
    description: 'New position when repositioning an assignment',
    displayOptions: { show: { resource: ['task'], operation: ['assignment_reposition'] } },
  },
  {
    displayName: 'Estimated Time (minutes) - assignment',
    name: 'assignment_estimated_time',
    type: 'number',
    default: 0,
    description: 'Estimated time in minutes when reestimating an assignment',
    displayOptions: { show: { resource: ['task'], operation: ['assignment_reestimate'] } },
  },
];

export const TaskDescription: INodeProperties[] = [
  ...taskOperations,
  ...taskFields,
];

export default TaskDescription;

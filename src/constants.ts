export const EVENT_SCREEN_STATE_CHANGE = 'mainScreen';
export const EVENT_APPEND_LOG = 'appendLog';
export const URL_SCRIPT_OBRIGATORIO = 'https://www.dropbox.com/s/4ub6n18no37o356/scripts.sql?dl=1';
export const REGEX_NUMEROCASO = /(?<=.*)\d{5}$/g;
export const BITRIX_METHODS = {
  getTask: {method: 'tasks.task.get', requiredParams: ['taskId']},
  getStage: {method: 'task.stages.get', requiredParams: ['entityId']}
};
export const BITRIX_FIELDS = [
  'ID',
  'PARENT_ID',
  'TITLE',
  'DESCRIPTION',
  'MARK',
  'PRIORITY',
  'TITLE',
  'STATUS',
  'MULTITASK',
  'NOT_VIEWED',
  'REPLICATE',
  'GROUP_ID',
  'STAGE_ID',
  'CREATED_BY',
  'CREATED_DATE',
  'RESPONSIBLE_ID',
  'ACCOMPLICE',
  'AUDITOR',
  'CHANGED_BY',
  'CHANGED_DATE',
  'STATUS_CHANGED_DATE',
  'CLOSED_BY',
  'CLOSED_DATE',
  'DATE_START',
  'DEADLINE',
  'START_DATE_PLAN',
  'END_DATE_PLAN',
  'GUID',
  'XML_ID',
  'COMMENTS_COUNT',
  'NEW_COMMENTS_COUNT',
  'TASK_CONTROL',
  'ADD_IN_REPORT',
  'FORKED_BY_TEMPLATE_ID',
  'TIME_ESTIMATE',
  'TIME_SPENT_IN_LOGS',
  'MATCH_WORK_TIME',
  'FORUM_TOPIC_ID',
  'FORUM_ID',
  'SITE_ID',
  'SUBORDINATE',
  'FAVORITE',
  'VIEWED_DATE',
  'SORTING',
  'DURATION_PLAN',
  'DURATION_FACT',
  'DURATION_TYPE'
  ];

export const FIELDS_USED_IN_BITRIX_API = [
  'UF_AUTO_675766807491', // Campo de código do cliente;
  'DESCRIPTION',
  'TITLE',
  'PRIORITY',
  'ID',
  'STADE_ID',
  'CREATE_DATE',
  'CREATOR_ID'
]
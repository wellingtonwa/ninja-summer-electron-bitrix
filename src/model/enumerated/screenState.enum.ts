export enum  ScreenState {
  CONFIG = 'CONFIG',
  DASHBOARD = 'DASHBOARD',
  RESTORE = 'RESTORE',
  UPDATE = 'UPDATE',
}

export const MAP_SCREEN_STATE: {
  [key: string]: string
} = {
  [ScreenState.CONFIG]: '/app/config',
  [ScreenState.DASHBOARD]: '/app/dashboard',
  [ScreenState.RESTORE]: '/app/restore',
  [ScreenState.UPDATE]: '/update',
}

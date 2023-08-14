export enum  ScreenState {
  CONFIG = 'CONFIG',
  HOME = 'HOME',
  RESTORE = 'RESTORE',
  UPDATE = 'UPDATE',
}

export const MAP_SCREEN_STATE: {
  [key: string]: string
} = {
  [ScreenState.CONFIG]: '/app/config',
  [ScreenState.HOME]: '/app/home',
  [ScreenState.RESTORE]: '/app/restore',
  [ScreenState.UPDATE]: '/update',
}

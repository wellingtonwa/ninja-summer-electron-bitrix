export enum  ScreenState {
  CONFIG = 'CONFIG',
  HOME = 'HOME',
  RESTORE = 'RESTORE',
}

export const MAP_SCREEN_STATE: {
  [key: string]: string
} = {
  [ScreenState.CONFIG]: '/config',
  [ScreenState.HOME]: '/home',
  [ScreenState.RESTORE]: '/restore',
}
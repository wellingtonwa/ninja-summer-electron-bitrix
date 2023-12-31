import { app, ipcMain, shell } from "electron";
import eventService from "./event.service";
import windowService from "./window.service";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { EVENT_SCREEN_STATE_CHANGE } from "../../constants";
import configController from "../controllers/config.controller";
import updateService from "../service/update.service";

class MainService {

  globalActionsRegistered = false;
  screenState: ScreenState;
  ignoreUpdate: boolean;

  constructor() {
    this.screenState = ScreenState.CONFIG;
    this.ignoreUpdate = process.argv.includes('--ignore-update');
  }

  async init() {
    if (!this.ignoreUpdate && await updateService.checkUpdate()) {
      this.screenState = ScreenState.UPDATE;
    } else {
      if (configController.getConfiguracao()) {
        this.screenState = ScreenState.DASHBOARD;
      } else {
        this.screenState = ScreenState.CONFIG;
      }
    }

    this.initWindow();
  }

  initWindow() {
    eventService.registerControllers();
    this.registerGlobalActions();
    windowService.createMainWindow();
  }

  registerGlobalActions() {
    if (!this.globalActionsRegistered) {
      ipcMain.on('getControllerActions', e => {
        e.returnValue = eventService.getControllerActions();
      });
      ipcMain.on('isPackaged', e => {
        e.returnValue = app.isPackaged;
      });

      ipcMain.on('open-external-browser', (event, arg) => {
        console.log(arg);
      });
    }

    this.globalActionsRegistered = true;
  }

  setScreenState(newState: ScreenState) {
    this.screenState = newState;
    windowService.emitEvent(EVENT_SCREEN_STATE_CHANGE, this.screenState);
  }

  openLink(url: string) {
    shell.openExternal(url);
  }

}

export default new MainService(); 

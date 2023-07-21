import { app, ipcMain } from "electron";
import eventService from "./event.service";
import windowService from "./window.service";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { EVENT_SCREEN_STATE_CHANGE } from "../../constants";
import configController from "../controllers/config.controller";

class MainService {

  globalActionsRegistered = false;
  screenState: ScreenState;

  constructor() {
    this.screenState = ScreenState.CONFIG;
  }

  async init() {
    
    if (configController.getConfiguracao()) {
      this.screenState = ScreenState.HOME;
    } else {
      this.screenState = ScreenState.CONFIG;
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
    }

    this.globalActionsRegistered = true;
  }

  setScreenState(newState: ScreenState) {
    this.screenState = newState;
    windowService.emitEvent(EVENT_SCREEN_STATE_CHANGE, this.screenState);
  }

}

export default new MainService(); 
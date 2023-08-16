import { app } from "electron";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import mainService from "../service/main.service";
import windowService from "../service/window.service";

class MainController {

  getScreenState() {
    return mainService.screenState ? mainService.screenState : ScreenState.CONFIG;
  }

  setScreenState(value: ScreenState) {
    mainService.setScreenState(value);
  }

  appendLog(mensagem: string) {
    windowService.appendLog(mensagem);
  }

  openLink(url: string) {
    mainService.openLink(url);
  }

  getVersion() {
    return app.getVersion();
  }

}

export default new MainController();

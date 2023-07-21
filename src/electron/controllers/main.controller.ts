import { ScreenState } from "../../model/enumerated/screenState.enum";
import mainService from "../service/main.service";

class MainController {

  getScreenState() {
    return mainService.screenState ? mainService.screenState : ScreenState.CONFIG;
  }

  setScreenState(value: ScreenState) {
    mainService.setScreenState(value);
  }

}

export default new MainController();
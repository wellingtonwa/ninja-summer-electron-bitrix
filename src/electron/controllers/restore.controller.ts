import { Configuracao } from "../../model/configuracao";
import { RestoreLink } from "../../model/restoreLink";
import restoreService from "../service/restore.service";
import configController from "./config.controller";

class RestoreController {

  async restoreLink(values: RestoreLink) {
    let config: Configuracao = await configController.getConfiguracao();
    let filePath = await restoreService.httpsDownload({url: values.link, dest: config.dbBackupFolder});
  }

}

export default new RestoreController();
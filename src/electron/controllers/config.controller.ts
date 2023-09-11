import { StoreKey } from "../../model/enumerated/storeKey.enum";
import { Configuracao } from "../../model/configuracao";
import storeService from "../service/store.service";
import { canReadAndWrite } from "../utils/ioUtils";

class ConfigController {
  private config: Configuracao;

  constructor() {
    this.config = storeService.get(StoreKey.CONFIG) as Configuracao;
  }

  getConfiguracao() {
    return this.config;
  }

  async setConfiguracao(value: Configuracao) {
    this.config = value;
    storeService.set(StoreKey.CONFIG, value);
  }

  async hasReadAndWriteAccess(path: string) {
    return canReadAndWrite(path);
  }

}

export default new ConfigController();

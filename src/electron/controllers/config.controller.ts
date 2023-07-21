import { StoreKey } from "../../model/enumerated/storeKey.enum";
import { Configuracao } from "../../model/configuracao";
import storeService from "../service/store.service";

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

}

export default new ConfigController();
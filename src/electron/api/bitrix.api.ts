import { AxiosInstance } from "axios";
import { create, getQueryParams } from "../utils/axios.util";
import configController from "../controllers/config.controller";
import { Configuracao } from "../../model/configuracao";
import { FiltroBitrix } from "../../model/filtroBitrix";

class BitrixApi {
  service: AxiosInstance;

  constructor() {
    const config:Configuracao = configController.getConfiguracao()
    this.service = create(config.bitrixApiURL, "/");
  }

  async getDadosBitrix(method: any, params: FiltroBitrix[]) {
    return this.service.get(`${method}${getQueryParams(params)}`).then(retorno => {
      let result = null;
      if (retorno.data) {
        result = retorno.data.result;
      }
      return result;
    });
  }

  reloadConfig() {
    const config:Configuracao = configController.getConfiguracao()
    this.service = create(config.bitrixApiURL, "/");
  }

}

export default new BitrixApi();
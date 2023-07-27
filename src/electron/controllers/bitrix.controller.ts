import { FiltroBitrix } from "../../model/filtroBitrix";
import { BITRIX_METHODS } from "../../constants";
import bitrixApi from "../api/bitrix.api";
import configController from "./config.controller";
import { isEmpty, isNull, isString } from "lodash";
import InformacaoBitrix from "../../model/informacaoBitrix";


class BitrixController {

  active: boolean;

  constructor() {
    this.checkConfig();
  }

  async getDadosTarefa(numeroTarefa: string | string[]): Promise<InformacaoBitrix[]> {
    const filtroKanban: FiltroBitrix = {'name': 'entityID', 'value': 68};
    const dadosKanban:any = await bitrixApi.getDadosBitrix(BITRIX_METHODS.getStage.method, [filtroKanban]);

    let filtrosTarefa: FiltroBitrix[];
    if(isString(numeroTarefa)) {
      filtrosTarefa = [{'name': 'taskId', 'value': numeroTarefa}];
    } else {
      filtrosTarefa = numeroTarefa.map(it => ({'name': 'taskId', 'value': it}));
    }
    
    const promisesDadosTarefas = filtrosTarefa.map(filtroTarefa => (bitrixApi.getDadosBitrix(BITRIX_METHODS.getTask.method, [filtroTarefa])))
    const dadosTarefas: any = await Promise.all(promisesDadosTarefas);

    let result: InformacaoBitrix[] = [];
    for (const item of dadosTarefas) {
      const task = item.task;
      if (task) {
        result.push({
          'id': task.id,
          'etapa': dadosKanban[task.stageId],
          'titulo': task.title,
          'descricao': task.description,
          'prioridade': task.priority,
          'createdDate': task.createdDate,
          'creator': task.creator,
          'responsible': task.responsible,
          'auditorsData': task.auditorsData,
          'group': task.group
        });
      }
    }
    return result;
  }

  async checkConfig() {
    const config = await configController.getConfiguracao();
    this.active = !isEmpty(config?.bitrixApiURL) && !isNull(config?.bitrixApiURL)
    bitrixApi.reloadConfig();
  }
  

  isActive() {
    return this.active;
  }
}

export default new BitrixController();
import { FiltroBitrix } from "../../model/filtroBitrix";
import ComentarioBitrix from "../../model/comentarioBitrix";
import { BITRIX_METHODS, FIELDS_USED_IN_BITRIX_API } from "../../constants";
import bitrixApi from "../api/bitrix.api";
import configController from "./config.controller";
import { isEmpty, isNull, isString } from "lodash";
import InformacaoBitrix from "../../model/informacaoBitrix";
import moment from "moment";

class BitrixController {

  active: boolean;

  constructor() {
    this.checkConfig();
  }

  async getDadosTarefa(numeroTarefa: string | string[]): Promise<InformacaoBitrix[]> {
    const filtroKanban: FiltroBitrix = {'name': 'entityID', 'value': 68};
    const dadosKanban:any = await bitrixApi.getDadosBitrix(BITRIX_METHODS.getStage.method, [filtroKanban]);

    let filtrosTarefa: FiltroBitrix[];
    const filtroCampoCodigoCliente = {'name': 'select[]', 'value': 'UF_AUTO_675766807491'}
    const filtroTodosOsCampos = {'name': 'select[]', 'value': '*'}
    if(isString(numeroTarefa)) {
      filtrosTarefa = [{'name': 'taskId', 'value': numeroTarefa}];
    } else {
      filtrosTarefa = numeroTarefa.map(it => ({'name': 'taskId', 'value': it}));
    }
    const promisesDadosTarefas = filtrosTarefa.map(filtroTarefa => (bitrixApi.getDadosBitrix(BITRIX_METHODS.getTask.method, [filtroTarefa, filtroCampoCodigoCliente, filtroTodosOsCampos ])))
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
          'createdDate': moment(task.createdDate).format('DD/MM/YYYY HH:mm:ss'),
          'creator': task.creator,
          'responsible': task.responsible,
          'auditorsData': task.auditorsData,
          'group': task.group,
          'codigoCliente': task.ufAuto675766807491,
        });
      }
    }
    return result;
  }

  async getComentariosTarefa(numeroTarefa: string): Promise<ComentarioBitrix> {
      const result = await bitrixApi.getDadosBitrix(BITRIX_METHODS.getComments.method, [{name: 'taskId', 'value': numeroTarefa}]);
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

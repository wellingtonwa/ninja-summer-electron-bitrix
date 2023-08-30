import moment from "moment";
import path  from 'path';
import { isEmpty, isNull, isString, isArray } from "lodash";
import { FiltroBitrix } from "../../model/filtroBitrix";
import ComentarioBitrix from "../../model/comentarioBitrix";
import InformacaoBitrix from "../../model/informacaoBitrix";
import AttachedObjectBitrix from "../../model/bitrix/attachedObjectBitrix";
import { BITRIX_METHODS } from "../../constants";
import bitrixApi from "../api/bitrix.api";
import configController from "./config.controller";
import fileManagerController from "./fileManager.controller";
import restoreService from "../service/restore.service";

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
          'attachments': task.ufTaskWebdavFiles,
        });
      }
    }
    return result;
  }

  async getComentariosTarefa(numeroTarefa: string): Promise<ComentarioBitrix> {
    const result = await bitrixApi.getDadosBitrix(BITRIX_METHODS.getComments.method, [{name: 'taskId', 'value': numeroTarefa}]);
    return result.map((comment: ComentarioBitrix) => ({...comment, ...{POST_DATE: moment(comment.POST_DATE).format('DD/MM/YYYY HH:mm:ss')}}));
  }

  async getArquivos(id: string | string[]): Promise<AttachedObjectBitrix[]> {
    let result: AttachedObjectBitrix[] = [];
    if (isString(id)) {
      result.push(await bitrixApi.getDadosBitrix(BITRIX_METHODS.getAttachedObject.method, [{name: 'id', 'value': id}]));
    } else {
      const requestPromises = id.map(it => bitrixApi.getDadosBitrix(BITRIX_METHODS.getAttachedObject.method, [{name: 'id', 'value': it}]));
      result = await Promise.all(requestPromises);
    }
    return result;
  }

  async checkConfig() {
    const config = await configController.getConfiguracao();
    this.active = !isEmpty(config?.bitrixApiURL) && !isNull(config?.bitrixApiURL)
    bitrixApi.reloadConfig();
  }
  
  async downloadAttachment(attachments: AttachedObjectBitrix | AttachedObjectBitrix[], informacaoBitrix: InformacaoBitrix) {
    let config = configController.getConfiguracao();
    const dest = path.resolve(config.issueFolder, `tarefa-${informacaoBitrix.id}`)
    if (!isArray(attachments)) {
      await restoreService.httpsDownload({url: attachments.DOWNLOAD_URL, dest: path.resolve(dest, attachments.NAME), hasFileNameOnPath: true });
    } else {
      const requestPromises = attachments.map(attachment => restoreService.httpsDownload({url: attachment.DOWNLOAD_URL, dest: path.resolve(dest, attachment.NAME), hasFileNameOnPath: true }));
      await Promise.all(requestPromises);
    }
  }

  isActive() {
    return this.active;
  }
}

export default new BitrixController();

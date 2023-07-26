import { EVENT_APPEND_LOG, URL_SCRIPT_OBRIGATORIO } from "../../constants";
import { Configuracao } from "../../model/configuracao";
import { RestoreLink } from "../../model/restoreLink";
import restoreService from "../service/restore.service";
import windowService from "../service/window.service";
import { descompactar, getFileContent } from "../utils/ioUtils";
import configController from "./config.controller";
import { copyFileSync } from 'fs';
import { exec } from 'child_process';
import dockerService from "../service/docker.service";
import { rename, renameSync } from "original-fs";
import postgresService from "../service/postgres.service";

const REGEX_ZIP_FILE = ".*\.zip$";

class RestoreController {

  async restoreLink(values: RestoreLink) {
    let config: Configuracao = await configController.getConfiguracao();
    let filePath;
    try {
      windowService.appendLog(`Fazendo download da URL ${values.link}`);
      filePath = await restoreService.httpsDownload({url: values.link, dest: config.downloadPath});
      // Verificando se o arquivo é compactado
      if (filePath.match(REGEX_ZIP_FILE)) {
        windowService.appendLog(`Descompactando o arquivo: ${filePath} em ${config.downloadPath}`);
        filePath = await descompactar({filePath, fileDest: config.downloadPath});
      }
      
      windowService.appendLog(`Copiando de ${filePath} to ${config.dbBackupFolder}`);
      renameSync(filePath, config.dbBackupFolder + '/database.backup');
    } catch (error) {
      console.log(error);
      windowService.appendLog(`Ocorreu um erro inesperado: ${error}`);
    }

    try {
      windowService.appendLog(`Dropando o banco: ${values.nomeBanco}`);
      console.log(`Dropando o banco: ${values.nomeBanco}`)
      await dockerService.droparDockerDatabaseTerminal(values.nomeBanco);
    } catch(ignore) {
      windowService.appendLog(`O banco de dados ${values.nomeBanco} não existe ou está em uso.`);
    }

    try {
      windowService.appendLog(`Criando banco: ${values.nomeBanco}`);
      console.log(`Criando banco: ${values.nomeBanco}`)
      await dockerService.criarDockerDatabaseTerminal(values.nomeBanco);
    } catch(ignore) {
      windowService.appendLog(`O banco de dados ${values.nomeBanco} não existe ou está em uso.`);
    }

    try {
      windowService.appendLog(`Restaurando a base de dados: ${values.nomeBanco}`);
      console.log(`Restaurando a base de dados: ${values.nomeBanco}`)
      await dockerService.restoreFileDockerTerminal({filePath:"", nomeBanco: values.nomeBanco, user: config.dbUser});
    } catch(error) {
      windowService.appendLog(`Houve um erro ao restaurar o banco: ${error}`);
    }

    try {
      windowService.appendLog(`Baixando o script obrigatório`);
      const scriptObrigatorioPath = await restoreService.httpsDownload({url: URL_SCRIPT_OBRIGATORIO, dest: config.downloadPath});
      console.log(scriptObrigatorioPath);
      const conteudoScript: string = await getFileContent({filePath: scriptObrigatorioPath});
      await postgresService.query(conteudoScript);
    } catch(error) {
      windowService.appendLog(`Houve um erro ao executar o script obrigatório: ${error}`);
    }
    
    windowService.appendLog(`Processo finalizado!!!`);
    
    
  }

}

export default new RestoreController();
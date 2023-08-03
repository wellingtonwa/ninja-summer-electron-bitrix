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
import { RestoreArquivo } from "../../model/restoreArquivo";

const REGEX_ZIP_FILE = ".*\.zip$";

class RestoreController {

  async restoreDatabase(values: RestoreLink | RestoreArquivo) {
    let { downloadPath, dbBackupFolder, dbUser}: Configuracao = await configController.getConfiguracao();

    let filePath;
    if ('link' in values) {
      try {
        windowService.appendLog(`Fazendo download da URL ${values.link}`);
        filePath = await restoreService.httpsDownload({url: values.link, dest: downloadPath});
      } catch (error) {
        windowService.appendLog(`Ocorreu um erro inesperado: ${error}`);
      }
    } else {
     filePath = values.arquivo; 
    }

      // Verificando se o arquivo é compactado
    if (filePath.match(REGEX_ZIP_FILE)) {
      windowService.appendLog(`Descompactando o arquivo: ${filePath} em ${downloadPath}`);
      filePath = await descompactar({filePath, fileDest: downloadPath});
    }
    
    windowService.appendLog(`Copiando de ${filePath} to ${dbBackupFolder}`);
    renameSync(filePath, dbBackupFolder + '/database.backup');

    try {
      windowService.appendLog(`Dropando o banco: ${values.nomeBanco}`);
      console.log(`Dropando o banco: ${values.nomeBanco}`)
      await dockerService.droparDockerDatabaseTerminal(values.nomeBanco);
    } catch(ignore) {
      windowService.appendLog(`O banco de dados ${values.nomeBanco} não existe ou está em uso. Detalhes: ${ignore}`);
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
      await dockerService.restoreFileDockerTerminal({filePath:"", nomeBanco: values.nomeBanco, user: dbUser});
    } catch(error) {
      postgresService.reconnect();
      windowService.appendLog(`Houve um erro ao restaurar o banco: ${error}`);
    }

    try {
      windowService.appendLog(`Baixando o script obrigatório`);
      const scriptObrigatorioPath = await restoreService.httpsDownload({url: URL_SCRIPT_OBRIGATORIO, dest: downloadPath});
      const conteudoScript: string = await getFileContent({filePath: scriptObrigatorioPath});
      await postgresService.query(conteudoScript);
    } catch(error) {
      windowService.appendLog(`Houve um erro ao executar o script obrigatório: ${error}`);
    }
    
    windowService.appendLog(`Processo finalizado!!!`);
  }
}

export default new RestoreController();
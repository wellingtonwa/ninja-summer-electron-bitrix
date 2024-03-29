import { URL_SCRIPT_OBRIGATORIO } from "../../constants";
import { Configuracao } from "../../model/configuracao";
import { RestoreLink } from "../../model/restoreLink";
import { RestoreArquivo } from "../../model/restoreArquivo";
import restoreService from "../service/restore.service";
import dockerService from "../service/docker.service";
import postgresService from "../service/postgres.service";
import windowService from "../service/window.service";
import configController from "./config.controller";
import { descompactar, getFileContent } from "../utils/ioUtils";
import { renameSync } from "original-fs";

const REGEX_ZIP_FILE = ".*\.zip$";

class RestoreController {

  async restoreDatabase(values: RestoreLink | RestoreArquivo) {
    let { downloadPath, dbBackupFolder, dbUser, dbDocker }: Configuracao = await configController.getConfiguracao();

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
      if (dbDocker) {
        await postgresService.dropDatabase(values.nomeBanco);
      } else {
        await dockerService.droparDockerDatabaseTerminal(values.nomeBanco);
      }
    } catch(ignore) {
      windowService.appendLog(`O banco de dados ${values.nomeBanco} não existe ou está em uso. Detalhes: ${ignore}`);
    }

    try {
      windowService.appendLog(`Criando banco: ${values.nomeBanco}`);
      if (dbDocker) {
        await dockerService.criarDockerDatabaseTerminal(values.nomeBanco);
      } else {
        await postgresService.createDataBase(values.nomeBanco);
      }
    } catch(ignore) {
      windowService.appendLog(`O banco de dados ${values.nomeBanco} não existe ou está em uso.`);
    }

    try {
      windowService.appendLog(`Restaurando a base de dados: ${values.nomeBanco}`);
      if (dbDocker) {
        await dockerService.restoreFileDockerTerminal({filePath:"", nomeBanco: values.nomeBanco, user: dbUser});
      } else {
        await postgresService.restoreDatabase({filePath: dbBackupFolder, database: values.nomeBanco});
      }
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

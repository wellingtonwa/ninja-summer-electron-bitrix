import { Dirent, readdirSync } from "original-fs";
import { FolderInfo } from "../../model/folderInfo";
import { REGEX_ISSUEFOLDER } from "../../constants";
import configController from "./config.controller";


class ByFolderController {

  async listFolder(): Promise<FolderInfo[]> {
    const config = configController.getConfiguracao();
    const folderContent: Dirent[] = readdirSync(config.issueFolder, {withFileTypes: true});
    console.log(folderContent[0]);
    const folders: FolderInfo[] = folderContent
      .filter(it => it.isDirectory() && it.name.match(REGEX_ISSUEFOLDER) !== null)
      .map(it => ({ nome: it.name, caminho: config.issueFolder }));
    for (let folder of folders) {
      const arquivos: Dirent[] = readdirSync(`${config.issueFolder}/${folder.nome}`, {withFileTypes: true});
      folder.quantidadeArquivos = arquivos.length;
    }
    return folders;
  }  

}

export default new ByFolderController();

import { writeFileSync } from "original-fs";
import path  from 'path';
import windowService from "../service/window.service";
import os from 'os';
import { spawn } from 'child_process';
import { createFolderIfNotExists } from "../utils/ioUtils";
import configController from "./config.controller";

const WIN32 = 'win32';
const LINUX = 'linux';

class FileManagerController {

    async openFolderSelection(buttonLabel: string, fileName: string = ''){
        const result = await windowService.openFolderSelection('Selecionar Pasta', buttonLabel, fileName);
        return result.canceled ? null : result.filePaths[0];
    }
    
    async openFolder (numeroTarefa: string) {
        let config = configController.getConfiguracao();
        const dirPath = path.resolve(config.issueFolder, `tarefa-${numeroTarefa}`)
        await createFolderIfNotExists({ dirPath });
        this._openFolder(dirPath);
    }

    async _openFolder(dirPath: string) {
        const fileExplorer = os.platform() === WIN32 ? 'explorer' : 'xdg-open';
        const process = spawn(fileExplorer, [`${dirPath}`], { detached: true, stdio: 'ignore' });
        process.unref();
    };

}

export default new FileManagerController();
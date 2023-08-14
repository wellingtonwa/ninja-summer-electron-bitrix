import { app } from "electron";
import { join } from "path";
import githubApi from "../api/github.api";
import { gt, isEmpty } from "lodash";
import downloadService from "./download.service";
import { writeFileSync } from "original-fs"

const REGEX_ASAR_EXTENSION = /.*\.asar$/;

class UpdateService {
  asarPath: string;

  constructor() {
    this.asarPath = join(app.getPath('userData'), 'core.asar');
  }

  async checkUpdate() {
    let retorno = false;

    const retornoConsulta = await githubApi.getLatestVersion();
    
    if (retornoConsulta && gt(retornoConsulta.tag_name, app.getVersion())) {
      retorno = true;
      this.update(retornoConsulta);
    }

    return retorno;
  }

  restartApplication(ignoreUpdate?: boolean) {
    setTimeout(() => {
      if (ignoreUpdate) {
        app.relaunch({ args: [...process.argv, '--ignore-update'] });
      } else {
        app.relaunch();
      }
      app.exit();
    }, 2000);
  }

  async update(githubData: any) {
    if (!isEmpty(githubData.assets)) {
      let asarFile = githubData.assets.find((it: any) => REGEX_ASAR_EXTENSION.test(it.name));
      if (asarFile) {
        let result;
        try {
          result = await githubApi.download(asarFile.browser_download_url);
          writeFileSync(this.asarPath, Buffer.from(result.data));
          this.restartApplication(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
    
  }
  
}

export default new UpdateService();

import { AxiosInstance } from "axios";
import { create } from "../utils/axios.util";
import { URL_GITHUB_API } from "../../constants";

class GithubApi {
  service: AxiosInstance;

  constructor() {
    console.log(URL_GITHUB_API);
    
    this.service = create(URL_GITHUB_API, '/');
  }

  getLatestVersion() {
   return this.service.get('releases/latest').then(result => {
      let retorno = null;
      if (result.data) {
        retorno = result.data;
      }
      return retorno;
    });
  }

  download(url: string) {
    return this.service.get(url, { responseType: 'arraybuffer'}); 
  }
}

export default new GithubApi();

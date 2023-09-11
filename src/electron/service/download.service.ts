import * as https from 'https';
import { saveDownloadedFile } from '../utils/ioUtils';
import LogService from '../../model/LogService';

const REGEX_SERVER = /(https:\/\/[a-z._-]*)/g;

class DownloadService {

    async download(params: {url: string, dest: string, hasFileNameOnPath: boolean, logFunction: LogService}): Promise<string> {
        const { url, dest, hasFileNameOnPath, logFunction } = params;
        return new Promise((resolve, reject) => {
             
          const request = https.get(url, async (response:any) => {
          
              var len = parseInt(response.headers['content-length'], 10);
              var body = "";
              var cur = 0;
              var total = len / 1048576; //1048576 - bytes in  1Megabyte

              if (logFunction  && total>0) {
                try {
                  logFunction.appendLog(`Tamanho do arquivo de download: ${total.toFixed(2)}`);
                } catch (error) {
                    console.log("Erro ao logar o tamanho do download>> " + error);
                }
              }

              response.on("data", function(chunk:any) {
                  body += chunk;
                  cur += chunk && chunk.length;
                  console.log("Downloading " + (100.0 * cur / len).toFixed(2) + " percent " + (cur / 1048576).toFixed(2) + " mb" + ". Total size: " + total.toFixed(2) + " mb");
              });

              if (response.statusCode === 200) {
                  resolve(saveDownloadedFile(response, dest, hasFileNameOnPath));
              }
              else if (response.statusCode === 301) {
                  REGEX_SERVER.lastIndex = 0;
                  const dados_url = await REGEX_SERVER.exec(url);
                  const base_url = dados_url[1];
                  var novaUrl = base_url + response.headers.location;
                  resolve(this.download({url: novaUrl, dest, hasFileNameOnPath, logFunction}));
              }
              else if (response.statusCode === 302) {
                  if (response.headers.location.match('^http.*')) {
                      resolve(this.download({url: response.headers.location, dest, hasFileNameOnPath, logFunction}));
                  } else {
                      resolve(this.download({url: `${response.req.protocol}//${response.req.host}${response.headers.location}`, dest, hasFileNameOnPath, logFunction}));
                  }
                  
              }
          });

        });
    }

}

export default new DownloadService();

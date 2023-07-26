import * as https from 'https';
import { saveDownloadedFile } from './ioUtils';

const REGEX_SERVER = /(https:\/\/[a-z._-]*)/g;

export async function download(url:string, dest:string, hasFileNameOnPath = false): Promise<string> {
  return new Promise((resolve, reject) => {

      const request = https.get(url, async (response:any) => {
          
          var len = parseInt(response.headers['content-length'], 10);
          var body = "";
          var cur = 0;
          var total = len / 1048576; //1048576 - bytes in  1Megabyte

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
              resolve(download(novaUrl, dest, hasFileNameOnPath));
          }
          else if (response.statusCode === 302) {
              if (response.headers.location.match('^http.*')) {
                  resolve(download(response.headers.location, dest, hasFileNameOnPath));
              } else {
                  resolve(download(`${response.req.protocol}//${response.req.host}${response.headers.location}`, dest, hasFileNameOnPath));
              }
              
          }
      });
  });
}
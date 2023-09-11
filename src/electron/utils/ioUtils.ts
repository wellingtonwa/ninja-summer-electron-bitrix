import path from 'path';
import fs, { constants } from 'fs';
import admZip from 'adm-zip';

const REGEX_DOWNLOADED_FILENAME = /(?<=attachment; filename=").*(?=";)/g;
const REGEX_ARQUIVOBACK = /.*\.backup$/g;

// Tests user's permissions for file or directory specified by path
export const canReadAndWrite = (path: string) => {
  try {
    fs.accessSync(path, constants.R_OK | constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export const apagarArquivo = (arquivo: any) => {
  const dir = path.join(__dirname, `../../uploads/${arquivo}`);
  return new Promise((resolve, reject) => {
    fs.unlink(dir, err => {
      if (err) reject(err);
      resolve(`${arquivo} - arquivo apagado!`);
    });
  });
};

export const getFileContent = (params: any): Promise<string> => {
  var mergedParams = params;
  if (!params.charset) mergedParams = {...params, ...{charset: 'utf-8'}}
  return new Promise((resolve, reject) => {
    fs.readFile(mergedParams.filePath, mergedParams.charset, (error, data) => {
      if(error) reject(Error(error.message));
      resolve(data.toString());
    });
  })  
}

export const createFolderIfNotExists = (params: any) => {
  return new Promise((resolve, reject) => {
    const fe = fs.existsSync(params.dirPath);
    const options = params.recursive ? { recursive: true } :  { recursive: false };
    if (!fe){
      try {
        fs.mkdirSync(params.dirPath, options);
        resolve(true);
      } catch(error) {
        reject(error);
      }
    } else {
      resolve(true);
    }
  });
};

export const listFiles = async (dirPath: string) => {
    await createFolderIfNotExists({ dirPath });
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, function(err, files) {
        //handling error
        if (err) reject(err);
        var arquivos: any = [];
        files.forEach(function(file) {
          arquivos.push(file);
        });
        resolve(arquivos);
      });
    });
  };

  export const saveDownloadedFile = (response:any, dest:string, hasFileNameOnPath = false): Promise<string> => {
    return new Promise((resolve, reject) => {
      var filePath:string;
      
      if (hasFileNameOnPath) {
          filePath = dest;
      } else {
        REGEX_DOWNLOADED_FILENAME.lastIndex = 0
        const contentDispositionData = REGEX_DOWNLOADED_FILENAME.exec(response.headers["content-disposition"]);
        let fileName = contentDispositionData[0];
        filePath = path.resolve(__dirname, `${dest}/${fileName}`);
      }
      
      createFolderIfNotExists({ dirPath: path.dirname(filePath)});
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      console.log('Antes de logar o erro >>>>>>>>>');
  
      file.on("finish", () => {
        resolve(filePath);
      });
  
      file.on("error", (err: any) => {
        file.close();
  
        if (err.code === "EXIST") {
          reject("File already exists");
        } else {
          !hasFileNameOnPath && fs.unlink(dest, () => {}); // Delete temp file
          console.log(err);
          reject(Error(err.message));
        }
      });
    });
  }
 
  export const descompactar = (params: {filePath: string, fileDest: string}): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!params.fileDest) {
        reject('O destino do arquivo não foi informado');
      }
      let zip = new admZip(params.filePath);
      let zipEntries = zip.getEntries();
      zipEntries.filter(it => it.entryName.match(REGEX_ARQUIVOBACK)).forEach(it => {
        var fileDest;
        if (params.fileDest) {
          fileDest = params.fileDest + '/calima.backup'
        }
        
        fs.writeFile(fileDest, it.getData(), function (err) {
          if (err) {
            console.log(err)
            reject(err);
          }
        });
        resolve(fileDest);
      });
      reject(Error("Arquivo não encontrado"))
    });
  };

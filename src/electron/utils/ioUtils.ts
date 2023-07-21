import path from "path";
import fs from "fs";

const REGEX_DOWNLOADED_FILENAME = /(?<=attachment; filename=").*(?=";)/g;

export const apagarArquivo = (arquivo: any) => {
  const dir = path.join(__dirname, `../../uploads/${arquivo}`);
  return new Promise((resolve, reject) => {
    fs.unlink(dir, err => {
      if (err) reject(err);
      resolve(`${arquivo} - arquivo apagado!`);
    });
  });
};

export const getFileContent = (params: any) => {
  var mergedParams = params;
  if (!params.charset) mergedParams = {...params, ...{charset: 'utf-8'}}
  return new Promise((resolve, reject) => {
    fs.readFile(mergedParams.filePath, mergedParams.charset, (error, data) => {
      if(error) reject(Error(error.message));
      resolve(data);
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
      } catch(error) {
        reject(error);
      }
    } else {
      resolve(false);
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
  
      file.on("finish", () => {
        resolve(filePath);
      });
  
      file.on("error", (err: any) => {
        file.close();
  
        if (err.code === "EXIST") {
          reject("File already exists");
        } else {
          fs.unlink(dest, () => {}); // Delete temp file
          reject(Error(err.message));
        }
      });
    });
  };
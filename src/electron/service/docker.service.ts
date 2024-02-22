import { Docker } from "node-docker-api";
import windowService from "./window.service";
import { exec } from "child_process";
import { findProcess } from "../utils/system.util";
import { REGEX_DOCKER_BIN_FOLDER } from "../../constants";
import { isEmpty } from "lodash";

class DockerService {

  docker: Docker;
  binariesPath: String;
  hasBinaries: Boolean;

  constructor() {
    this.findBinariesPath();
    if (this.hasBinaries) {
      this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    }
  }

  getHasBinaries(): Boolean {
    return this.hasBinaries;
  }

  /**
 * Restaura uma base de dados Docker
 * @param {filePath:string, nomeBanco:string} params
 */
  async restoreFileDocker (params: {filePath: string, nomeBanco: string, user: string}) {
    this.docker.container.get('postgres').exec.create({
      Cmd: [`/usr/bin/pg_restore`, `-U`, `${params.user}`,  `-v`, `-d`, `${params.nomeBanco}`, `/opt/bkp/database.backup`],
      AttachStdout: true
    })
    .then(exec => exec.start({Detach: false})).then((stream:any) => {
      stream.on('data', (data:any) => {
        windowService.appendLog(data.toString());
      })
    });
  }
  
  async criarDockerDatabase(nomeBanco: string): Promise<Object> {
    return this.docker.container.get('postgres').exec.create({Cmd: ['psql', '-U', 'postgres', '-c', `CREATE DATABASE ${nomeBanco}`]}).then(exec => exec.start({Detach: true}));
  }

  async droparDockerDatabase(nomeBanco: string): Promise<Object> {
    return this.docker.container.get('postgres').exec.create({Cmd: ['psql', '-U', 'postgres', '-c', `DROP DATABASE ${nomeBanco}`]}).then(exec => exec.start({Detach: false}));
  }

  restoreFileDockerTerminal (params: {filePath: string, nomeBanco: string, user: string}): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `docker exec -t postgres sh -c "pg_restore -U ${params.user} -v --dbname ${params.nomeBanco} /opt/bkp/database.backup"`,
        {maxBuffer: 1024 * 50000}, (error, stdout, stderr) => {
          if(error) {
            console.log(error);
            reject(error);
            return;
          }
          resolve(stdout);
        });
    }) 
  }

  droparDockerDatabaseTerminal(nomeBanco: string): Promise<String> {
    return new Promise((resolve, reject) => {
      exec(`docker exec -t postgres psql -U postgres -c "DROP DATABASE ${nomeBanco}"`, (error, stdout, stderr) => {
        if(error)
          reject(stderr);
        resolve(stdout);
      })
    })
  }
  
  criarDockerDatabaseTerminal(nomeBanco: String): Promise<String> {
    return new Promise((resolve, reject) =>{ 
      exec(`docker exec -t postgres psql -U postgres -c "CREATE DATABASE ${nomeBanco}"`,(error, stdout, stderr) => {
        if (error) {
          reject(error)
          return;
        }
        resolve(stdout);
      })
    });
  }

  async findBinariesPath() {
    let resultado: String = null;
    try {
      resultado = await findProcess('dockerd', '| grep -- -H');
      if (resultado && !isEmpty(resultado.match(REGEX_DOCKER_BIN_FOLDER))) {
        this.binariesPath = resultado.match(REGEX_DOCKER_BIN_FOLDER)[0];
        this.hasBinaries = true;
      }
    } catch (error) {
      this.binariesPath = '';
      this.hasBinaries = false;
      console.log(`Erro ao tentar obter o caminho dos binários do postgres:\n Detalhes: ${error}`)
    }
  }
}

export default new DockerService();

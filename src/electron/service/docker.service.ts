import { Docker } from "node-docker-api";
import { Exec } from "node-docker-api/lib/container";
import windowService from "./window.service";
import { exec, ChildProcess } from "child_process";
import { utilityProcess } from "electron";

class DockerService {

  docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  /**
 * Restaura uma base de dados Docker
 * @param {filePath:string, nomeBanco:string} params
 */
  async restoreFileDocker (params: {filePath: string, nomeBanco: string, user: string}) {
    console.log(`pg_restore -U ${params.user} -d ${params.nomeBanco} /opt/bkp/database.backup`);
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

  restoreFileDockerTerminal (params: {filePath: string, nomeBanco: string, user: string}): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `docker exec -t postgres sh -c "pg_restore -U ${params.user} -v --dbname ${params.nomeBanco} /opt/bkp/database.backup"`,
        {maxBuffer: 1024 * 50000}, (error, stdout, stderr) => {
          if(error) {
            reject(error);
            return;
          }
          resolve(stdout);
        });
    }) 
  }

  async droparDockerDatabase(nomeBanco: string): Promise<Object> {
    return this.docker.container.get('postgres').exec.create({Cmd: ['psql', '-U', 'postgres', '-c', `DROP DATABASE ${nomeBanco}`]}).then(exec => exec.start({Detach: false}));
  }

  droparDockerDatabaseTerminal(nomeBanco: string): Promise<String> {
    return new Promise((resolve, reject) => {
      exec(`docker exec -t postgres psql -U postgres -c "DROP DATABASE ${nomeBanco}"`, (error, stdout, stderr) => {
        if(error)
          reject(error);
        resolve(stdout);
      })
    })
  }
  
  async criarDockerDatabase(nomeBanco: string): Promise<Object> {
    return this.docker.container.get('postgres').exec.create({Cmd: ['psql', '-U', 'postgres', '-c', `CREATE DATABASE ${nomeBanco}`]}).then(exec => exec.start({Detach: true}));
  }
  
  criarDockerDatabaseTerminal(nomeBanco: string): Promise<String> {
    return new Promise((resolve, reject) =>{ exec(`docker exec -t postgres psql -U postgres -c "CREATE DATABASE ${nomeBanco}"`,(error, stdout, stderr) => {
      if (error) {
        reject(error)
        return;
      }
      resolve(stdout);
    })});
  }

}

export default new DockerService();
import { Client, ClientConfig, Query } from 'pg';
import configController from '../controllers/config.controller';
import { exec } from 'child_process';
import dockerService from './docker.service';

export interface ConnectionConfigProps {
  user: string;
  password: string;
  port: string;
  host: string;
  database: string;
}

class PostgresService {
  
  private connection: Client;
  private connected: boolean;

  constructor() {
    this.connection = new Client(this.getConfig());
    this.connected = true;
    this.connection.connect((error) => {
      if (error) {
        this.connected = false;
      }
    });
  }

  getConfig(): ClientConfig {
    let configuracao = configController.getConfiguracao();
    let result: ClientConfig = null;
    if (configuracao) {
      result = {
        user: configuracao.dbUser,
        password: configuracao.dbPassword,
        host: configuracao.dbHostname,
        port: Number(configuracao.dbPort),
        database: configuracao.dbDefaultDatabase,
      }
    }
    return result;
  }

  async reconnect() {
    this.connection = new Client(this.getConfig());
    await this.connection.connect((error) => {
      this.connected = true;
      if (error) {
        this.connected = false;
      }
    });
  }

  hasConnection(): boolean {
    return this.connected;
  }

  getConnection(): Client {
    return this.connection;
  }

  async query (query: string) {    
    const result = await this.getConnection().query(query);
    return result.rowCount ? result.rows : null;
  };

  async dropDatabase (database: string) {
    await dockerService.droparDockerDatabaseTerminal(database);
  }

  async hasBinaries() {
    return new Promise((resolve, reject) => {
      exec(`pg --version`, (error, stdout, stderr) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(stdout);
      })
    });
  }

}

export default new PostgresService();

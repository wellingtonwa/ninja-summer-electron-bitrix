import { Client, ClientConfig } from 'pg';
import configController from '../controllers/config.controller';
import { exec } from 'child_process';
import dockerService from './docker.service';
import { isEmpty, reject } from "lodash";
import { REGEX_POSTGRES_BIN_FOLDER } from '../../constants';
import { findProcess } from '../utils/system.util';

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
  private binaries: boolean;
  private binariesPath: String;
  private isDocker: boolean;
  private pwd: String;

  constructor() {
    this.connection = new Client(this.getConfig());
    this.connected = true;
    this.connection.connect((error) => {
      if (error) {
        this.connected = false;
      }
    });
    this.findBinariesPath();
  }

  getConfig(): ClientConfig {
    let configuracao = configController.getConfiguracao();
    let result: ClientConfig = null;
    if (configuracao) {
      this.isDocker = configuracao.dbDocker;
      this.pwd = configuracao.dbPassword;
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

  getExportPWD(): String {
    return `export PGPASSWORD=${this.pwd};`;
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

  hasBinaries(): boolean {
    return this.binaries;
  }

  getBinariesPath(): String {
    return this.binariesPath;
  }

  async query (query: string) {    
    const result = await this.getConnection().query(query);
    return result.rowCount ? result.rows : null;
  };

  async createDataBase(database: String): Promise<String> {
    const config: ClientConfig = await this.getConfig();
    return new Promise((resolve, reject) => {
      exec(`${this.getExportPWD()} ${this.binariesPath}psql -h ${config.host} -p ${config.port} -U ${config.user} -c "CREATE DATABASE ${database}"`, (error, stdout, sterr) => {
        if (error) {
          console.error(sterr);
          reject(error);
          return;
        }
        resolve(stdout);
      })
    });
  }

  async dropDatabase (database: string): Promise<String> {
    const config: ClientConfig = await this.getConfig();
    return new Promise((resolve, reject) => {
      exec(`${this.getExportPWD()} ${this.binariesPath}psql -h ${config.host} -p ${config.port} -U ${config.user} -c "DROP DATABASE ${database}"`, (error, stdout, sterr) => {
        if (error) {
          console.error(sterr);
          reject(error);
          return;
        }
        resolve(stdout);
      })
    })
  }

  async restoreDatabase (params: { database: String, filePath: String }) {
    const config: ClientConfig = await this.getConfig();
    return new Promise((resolve, reject) => {
      exec(`${this.getExportPWD()} ${this.binariesPath}pg_restore -U ${config.user} -p ${config.port} -v --dbname ${params.database} ${params.filePath}/database.backup `, (error, stdout, sterr) => {
        if (sterr) {
          console.log(error);
          reject(sterr);
          return;
        } 
        resolve(stdout);
      })
    })
  }

  async findBinaries(): Promise<String> {
    return new Promise((resolve, reject) => {
      exec(`ps auxw | grep postgres | grep -- -D`, (error, stdout, sterr) => {
        if (error) {
          console.error(sterr);
          reject(error);
          return;
        }
        resolve(stdout);
      });
    }) 
  }

  async findBinariesPath() {
    let resultado: String = null;
    try {
      resultado = await findProcess('postgres', '| grep -- -D');
      if (resultado && !isEmpty(resultado.match(REGEX_POSTGRES_BIN_FOLDER))) {
        this.binariesPath = resultado.match(REGEX_POSTGRES_BIN_FOLDER)[0];
        this.binaries = true;
      }
    } catch (error) {
      this.binariesPath = '';
      this.binaries = false;
      console.log(`Erro ao tentar obter o caminho dos binários do postgres:\n Detalhes: ${error}`)
    }
  }

  async getPGSQLVersion() {
    return new Promise((resolve, reject) => {
      exec(`ls /opt/PostgreSQL/`, (error, stdout, sterr) => {
        if (error) {
          console.error(sterr);
          reject(error);
          return;
        }
        resolve(stdout);
      })
    });
  }

}

export default new PostgresService();

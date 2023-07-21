import { Client, Query } from 'pg';
import configController from '../controllers/config.controller';

export interface ConnectionConfigProps {
  user: string;
  password: string;
  port: string;
  host: string;
  database: string;
}

class PostgresService {
  
  private connection: Client;

  constructor() {
    this.connection = new Client(this.getConfig());
    this.connection.connect();
  }

  getConfig(): ConnectionConfigProps {
    let configuracao = configController.getConfiguracao();
    let result = null;
    if (configuracao) {
      result = {
        user: configuracao.dbUser,
        password: configuracao.dbPassword,
        host: configuracao.dbHostname,
        port: configuracao.dbPort,
        database: configuracao.dbDefaultDatabase,
      }
    }
    return result;
  }

  async reconnect() {
    this.connection = new Client(this.getConfig());
    await this.connection.connect();
  }

  hasConnection(): Promise<boolean> {
    return  this.connection && this.connection._connected;
  }

  getConnection(): Client {
    return this.connection;
  }

  query = async (query: string) => {    
    const result = await this.getConnection().query(query);
    return result.rowCount ? result.rows : null;
  };

}

export default new PostgresService();
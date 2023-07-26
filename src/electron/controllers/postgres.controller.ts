import postgresService from "../service/postgres.service";

class PostgresController {
  
  async reconnect() {
    await postgresService.reconnect();
  }

  async hasConnection() {
    return await postgresService.hasConnection();
  }

  async dropDatabase(database: string) {
    return await postgresService.dropDatabase(database);
  }

}

export default new PostgresController();
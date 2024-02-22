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

  async hasBinaries() {
    return await postgresService.hasBinaries();
  }

  async getBinariesPath() {
    return await postgresService.getBinariesPath();
  }

}

export default new PostgresController();

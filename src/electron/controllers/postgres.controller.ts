import postgresService from "../service/postgres.service";

class PostgresController {
  
  async reconnect() {
    await postgresService.reconnect();
  }

  async hasConnection() {
    return await postgresService.hasConnection();
  }

}

export default new PostgresController();
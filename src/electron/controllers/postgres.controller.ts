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
    try {
      await postgresService.hasBinaries();
      return true;
    } catch (error) {
      console.error(`Erro ao verificar a existência dos binários do postgres. Detalhes: ${error}`);
      return false;
    }

  }

}

export default new PostgresController();

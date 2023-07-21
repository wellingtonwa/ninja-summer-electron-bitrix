import postgresService from "../service/postgres.service";

class DashboardController {

  async getDbnames() {
    return await postgresService.query(`SELECT datname as dbname FROM pg_database 
                    WHERE datistemplate = false
                    ORDER BY datname`);
  }

}

export default new DashboardController();
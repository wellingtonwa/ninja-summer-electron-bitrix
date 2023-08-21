import postgresService from "../service/postgres.service";

class DashboardController {

  async getDbnames(name?: string) {
    return await postgresService.query(`SELECT datname as dbname FROM pg_database 
                    WHERE datistemplate = false and datname LIKE '%${name || ''}%'
                    ORDER BY datname`);
  }

}

export default new DashboardController();

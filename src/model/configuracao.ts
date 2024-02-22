export interface Configuracao {
  dbUser: string;
  dbPassword: string;
  dbHostname: string;
  dbPort: string;
  dbBackupFolder: string;
  dbPrefix: string;
  dbDefaultDatabase: string;
  dbIgnore: string;
  dbDocker: boolean;
  downloadPath: string;
  issueFolder?: string;
  configVersion?: string;
  bitrixApiURL?: string;
}

export interface Configuracao {
  dbUser: string;
  dbPassword: string;
  dbHostname: string;
  dbPort: string;
  dbBackupFolder: string;
  dbPrefix: string;
  dbDefaultDatabase: string;
  dbIgnore: string;
  downloadPath: string;
  issueFolder?: string;
  configVersion?: string;
  bitrixApiURL?: string;
}

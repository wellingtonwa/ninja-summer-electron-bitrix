import { Restore } from "./restore";

export interface RestoreArquivo extends Restore {
  nomeBanco: string;
  arquivo: string;
}
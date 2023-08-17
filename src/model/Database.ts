import InformacaoBitrix from "./informacaoBitrix";

export default interface Database {
  dbname: string;
  isTarefa?: boolean;
  informacaoBitrix?: InformacaoBitrix;
}

import EtapaBitrix from "./etapaBitrix";
import GrupoBitrix from "./grupoBitrix";
import UserBitrix from "./userBitrix";

export default interface InformacaoBitrix {
    id?: string;
    tag?: string[];
    titulo?: string;
    descricao?: string;
    prioridade: string;
    createdDate: string;
    etapa: EtapaBitrix;
    creator?: UserBitrix;
    responsible?: UserBitrix;
    auditorsData?: UserBitrix[];
    group?: GrupoBitrix;
    codigoCliente?: string;
    attachments?: any[];
    loading?: boolean;
}

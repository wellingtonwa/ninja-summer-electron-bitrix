export default interface LogService {
    appendLog: (msg: string) => void;
    log: (msg: string) => void;
}

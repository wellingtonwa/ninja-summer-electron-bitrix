import { REGEX_NUMEROCASO } from "../../constants";

export function getNumeroTarefa(item: string) {
  const numeroCaso = item && REGEX_NUMEROCASO.test(item) && item.match(REGEX_NUMEROCASO);
  return numeroCaso ? numeroCaso[0] : null;
}

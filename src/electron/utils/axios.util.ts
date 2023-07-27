import axios from "axios";
import { FiltroBitrix } from "../../model/filtroBitrix";

export const create = (server: string, path: string) => {
  const instance = axios.create({baseURL: server + path});

  return instance;
}

export const getQueryParams = (params: FiltroBitrix[]) => {
  let queryParams = "";
  for(let param of params) {
      queryParams += queryParams === "" ? "?" : "&";
      queryParams += `${param.name}=${param.value}`;
  }
  return queryParams;
}
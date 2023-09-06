import { isUndefined } from "lodash";
import { LocalStorageKey } from "../../../model/enumerated/localStorageKey.enum";

export interface FormData {
  formName: LocalStorageKey;
  data: any;
}

export const saveFormData = (formData: FormData) => {
  localStorage.setItem(formData.formName, JSON.stringify(formData.data));
}

export const getFormData = (formName: LocalStorageKey): FormData => {
  const data = localStorage.getItem(formName);
  let result: FormData = {formName, data: undefined};
  if (!isUndefined(data)) {
    result.data = JSON.parse(data);
  }
  return result;
}

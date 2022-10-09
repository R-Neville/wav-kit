import { isObject, deepCopy } from "../../shared/utils";
import Config from "./Config";

export default function validateConfig(values: Config, defaults: Config) {
  const anyValues = <any>values;
  const anyDefaults = <any>defaults;

  for (const property in anyDefaults) {
    if (!Object.hasOwnProperty.call(anyValues, property)) {
      if (isObject(anyValues[property])) {
        anyValues[property] = deepCopy(anyDefaults[property]);
      } else {
        anyValues[property] = anyDefaults[property];
      }
    } else {
      if (isObject(anyValues[property])) {
        validateConfig(anyValues[property], anyDefaults[property]);
      }
    }
  }
}
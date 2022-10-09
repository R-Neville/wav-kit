export function isObject(value: any) {
  return typeof value === "object" && value !== null;
}

export function isEmpty(obj: object) {
  return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
}

export function deepCopy(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}
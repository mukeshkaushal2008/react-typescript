const objectToQuery = (obj: any) => {
  return Object.entries(obj).map(([k, v]: any) => `${k}=${encodeURIComponent(v)}`).join("&");
}
export { objectToQuery };
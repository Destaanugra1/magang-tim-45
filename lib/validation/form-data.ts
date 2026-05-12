export function getFormDataString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getFormDataFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

export function getFormDataFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File);
}

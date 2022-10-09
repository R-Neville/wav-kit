import { ipcRenderer } from "electron";

export async function importedFiles() {
  return await ipcRenderer.invoke("config:imported-files");
}

export function addImportedFile(path: string) {
  ipcRenderer.send("config:add-imported-file", { path });
}

export function removeImportedFile(index: number) {
  ipcRenderer.send("config:remove-imported-file", { index });
}
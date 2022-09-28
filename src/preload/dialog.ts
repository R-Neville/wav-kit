import { ipcRenderer } from "electron";

export function showErrorMessage(message: string) {
  ipcRenderer.send("dialog:error-message", { message });
}

export async function showOpenFolderDialog(): Promise<string|null> {
  return await ipcRenderer.invoke("dialog:open-folder");
}

export async function showOpenFileDialog() : Promise<string|null> {
  return await ipcRenderer.invoke("dialog:open-file");
}

export async function showOpenFilesDialog() : Promise<string[]|null> {
  return await ipcRenderer.invoke("dialog:open-files");
}
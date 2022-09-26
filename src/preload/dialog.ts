import { ipcRenderer } from "electron";

export async function showOpenFolderDialog(): Promise<string|null> {
  return await ipcRenderer.invoke("dialog:open-folder");
}

export function showErrorMessage(message: string) {
  ipcRenderer.send("dialog:error-message", { message });
}
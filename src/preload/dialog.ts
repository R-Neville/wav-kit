import { ipcRenderer } from "electron";

export async function showOpenFolderDialog(): Promise<string|null> {
  return await ipcRenderer.invoke("dialog:open-folder");
}
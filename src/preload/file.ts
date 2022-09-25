import { ipcRenderer } from "electron";

export function openFolder(path: string) {
  ipcRenderer.send("file:open-folder", { path });
}
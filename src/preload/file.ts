import fs from "fs";
import { ipcRenderer } from "electron";

export function openFolder(path: string) {
  ipcRenderer.send("file:open-folder", { path });
}

export function isInDir(name: string, dir: string) {
  const files = fs.readdirSync(dir);
  return files.filter((file) => file === name).length > 0;
}
import fs from "fs";
import { ipcRenderer } from "electron";
import { showErrorMessage } from "./dialog";

export function openFolder(path: string) {
  ipcRenderer.send("file:open-folder", { path });
}

export async function closeFolder(){
  ipcRenderer.send("file:close-folder");
}

export function isInDir(name: string, dir: string) {
  const files = fs.readdirSync(dir);
  return files.filter((file) => file === name).length > 0;
}

export function rename(oldPath: string, newPath: string) {
  try {
    fs.renameSync(oldPath, newPath);
    return true;
  } catch (error) {
    const message = `There was a problem renaming the file '${oldPath}': ${
      (error as Error).message
    }`;
    showErrorMessage(message);
    return false;
  }
}

export function renameFolder(oldPath: string, newPath: string) {
  try {
    fs.renameSync(oldPath, newPath);
    return true;
  } catch (error) {
    const message = `There was a problem renaming the folder '${oldPath}': ${
      (error as Error).message
    }`;
    showErrorMessage(message);
    return false;
  }
}

export function createFolder(path: string) {
  try {
    fs.mkdirSync(path);
  } catch (error) {
    const message = `There was a problem creating the folder '${path}': ${
      (error as Error).message
    }`;
    showErrorMessage(message);
  }
}
import fs from "fs";
import { ipcRenderer } from "electron";
import { showErrorMessage } from "./dialog";
import FileStats from "../shared/FileStats";

export function openFolder(path: string) {
  ipcRenderer.send("file:open-folder", { path });
}

export async function closeFolder() {
  ipcRenderer.send("file:close-folder");
}

export function isInDir(name: string, dir: string) {
  const files = fs.readdirSync(dir);
  return files.filter((file) => file === name).length > 0;
}

export async function readDir(path: string) {
  try {
    const files = await fs.promises.readdir(path);
    return files;
  } catch (error) {
    const message = `There was a problem reading the files in the folder ${path}: ${
      (error as Error).message
    }`;
    showErrorMessage(message);
    return null;
  }
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

export async function statsFromPath(path: string): Promise<FileStats|null> {
  return ipcRenderer.invoke("file:stats-from-path", { path });
}

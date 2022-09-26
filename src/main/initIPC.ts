import { ipcMain } from "electron";
import WavKit from "./WavKit";

export default function initIPC(app: WavKit) {
  ipcMain.on("file:open-folder", app.onOpenFolder.bind(app));
  ipcMain.on("file:close-folder", app.onCloseFolder.bind(app));
}
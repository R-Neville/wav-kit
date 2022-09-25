import { ipcMain } from "electron";
import WavKit from "./WavKit";

export default function initIPC(app: WavKit) {
  ipcMain.on("file:open-folder", app.onFileOpenFolder.bind(app));
}
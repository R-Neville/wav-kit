import { ipcMain } from "electron";
import WavKit from "./WavKit";

export default function initIPC(app: WavKit) {
  ipcMain.on("file:open-folder", app.onOpenFolder.bind(app));
  ipcMain.on("file:close-folder", app.onCloseFolder.bind(app));
  ipcMain.handle("file:stats-from-path", app.onStatsFromPath.bind(app));
  ipcMain.handle("config:imported-files", app.onConfigImportedFiles.bind(app));
  ipcMain.on("config:add-imported-file", app.onConfigAddImportedFile.bind(app));
  ipcMain.on("config:remove-imported-file", app.onConfigRemoveImportedFile.bind(app));
}
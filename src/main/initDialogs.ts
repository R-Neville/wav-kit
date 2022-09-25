import { ipcMain, dialog, BrowserWindow } from "electron";

export default function initDialogs(window: BrowserWindow) {
  ipcMain.handle("dialog:open-folder", async () => {
    const outcome = await dialog.showOpenDialog(window, {
      properties: ["openDirectory"]
    });
    if (outcome.canceled || outcome.filePaths.length === 0) {
      return null;
    } else {
      return outcome.filePaths[0];
    }
  });
}
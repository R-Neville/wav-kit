import os from "os";
import { ipcMain, dialog, BrowserWindow } from "electron";

export default function initDialogs(window: BrowserWindow) {
  ipcMain.on("dialog:error-message", (event, args) => {
    const { message } = args;

    dialog.showMessageBox(window, {
      type: "error",
      message,
      buttons: ["OK"],
    });
  });

  ipcMain.handle("dialog:open-folder", async () => {
    const outcome = await dialog.showOpenDialog(window, {
      title: "Open Folder",
      defaultPath: os.homedir(),
      properties: ["openDirectory"],
    });
    if (outcome.canceled || outcome.filePaths.length === 0) {
      return null;
    } else {
      return outcome.filePaths[0];
    }
  });

  ipcMain.handle("dialog:open-file", async () => {
    const outcome = await dialog.showOpenDialog(window, {
      title: "Open File",
      defaultPath: os.homedir(),
      properties: ["openFile"],
    });
    if (outcome.canceled || outcome.filePaths.length === 0) {
      return null;
    } else {
      return outcome.filePaths[0];
    }
  });

  ipcMain.handle("dialog:open-files", async () => {
    const outcome = await dialog.showOpenDialog(window, {
      title: "Open Files",
      defaultPath: os.homedir(),
      properties: ["openFile", "multiSelections"],
    });
    if (outcome.canceled || outcome.filePaths.length === 0) {
      return null;
    } else {
      return outcome.filePaths;
    }
  });
}

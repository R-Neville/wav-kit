import path from "path";
import fs from "fs";
import { app, BrowserWindow, Event as ElectronEvent } from "electron";
import mimeTypes from "mime-types";
import FSObserver from "./FSObserver";
import initDialogs from "./initDialogs";

const fsPromises = fs.promises;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));

  win.once("ready-to-show", () => {
    win.show();
  });

  initDialogs(win);

  return win;
};

class WavKit {
  private _window: BrowserWindow|null;
  private _fsObserver: FSObserver|null;
  
  constructor() {
    this._window = null;
    this._fsObserver = null;

    app.whenReady().then(() => {
      this._window = createWindow();
    
      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this._window = createWindow();
        }
      });
    });
    
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") app.quit();
    });
  }

  get window() {
    return this._window;
  }
  
  async onOpenFolder(event: ElectronEvent, args: { path: string }) {
    const { path } = args;
    if (this._fsObserver) {
      await this._fsObserver.close();
      this._fsObserver = null;
    }
    if (this._window) {
      this._fsObserver = new FSObserver(path, this._window);
    }
  }

  async onCloseFolder() {
    if (this._fsObserver) {
      await this._fsObserver.close();
      this._fsObserver = null;
    }
  }

  async onStatsFromPath(event: ElectronEvent, args: { path: string }) {
    const { path } = args;
    const mime = mimeTypes.lookup(path);
    if (!mime || !mime.includes("audio")) return null;
    const stats = await fsPromises.stat(path);
    const mb = (stats.size / (1024 * 1024)).toFixed(2);
    return { path, mime, mb };
  }
}

export default WavKit;
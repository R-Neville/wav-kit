import path from "path";
import { app, BrowserWindow, Event as ElectronEvent } from "electron";
import FSObserver from "./FSObserver";
import initDialogs from "./initDialogs";

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
  
  async onFileOpenFolder(event: ElectronEvent, args: { path: string }) {
    const { path } = args;
    if (this._fsObserver) {
      await this._fsObserver.close();
      this._fsObserver = null;
    }
    if (this._window) {
      this._fsObserver = new FSObserver(path, this._window);
    }
  }
}

export default WavKit;
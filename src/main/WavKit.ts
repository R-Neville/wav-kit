import path from "path";
import { app, BrowserWindow, Event as ElectronEvent } from "electron";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));

  win.once("ready-to-show", () => {
    win.show();
  });

  return win;
};

class WavKit {
  private _window: BrowserWindow|null;
  
  constructor() {
    this._window = null;

    app.whenReady().then(() => {
      this._window = createWindow();
    
      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) this._window = createWindow();
      });
    });
    
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") app.quit();
    });
  }

  get window() {
    return this._window;
  }

  onHelloWorld(event: ElectronEvent) {
    return "Hello, world!";
  }
}

export default WavKit;
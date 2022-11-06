import path from "path";
import fs from "fs";
import { app, BrowserWindow, Event as ElectronEvent } from "electron";
import mimeTypes from "mime-types";
import FSObserver from "./FSObserver";
import initDialogs from "./initDialogs";
import ConfigManager from "./config/ConfigManager";
import defaultConfig from "./config/defaultConfig";
import Playlist from "../shared/Playlist";

const fsPromises = fs.promises;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));

  win.once("ready-to-show", () => {
    win.show();
  });

  initDialogs(win);

  return win;
};

class WavKit {
  private _configManager: ConfigManager;
  private _window: BrowserWindow | null;
  private _fsObserver: FSObserver | null;

  constructor() {
    this._configManager = new ConfigManager(defaultConfig);
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

  async onOpenFolder(_event: ElectronEvent, args: { path: string }) {
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

  async onStatsFromPath(_event: ElectronEvent, args: { path: string }) {
    const { path } = args;
    const mime = mimeTypes.lookup(path);
    if (!mime || !mime.includes("audio")) return null;
    const stats = await fsPromises.stat(path);
    const mb = (stats.size / (1024 * 1024)).toFixed(2);
    return { path, mime, mb };
  }

  async onConfigImportedFiles() {
    const filenames = this._configManager.importedFiles;
    filenames?.forEach((filename, index) => {
      if (!fs.existsSync(filename)) {
        this._configManager.removeImportedFileAtIndex(index);
      }
    });
    return this._configManager.importedFiles;
  }

  onConfigAddImportedFile(_event: ElectronEvent, args: { path: string }) {
    const { path } = args;
    this._configManager.addImportedFile(path);
  }

  onConfigRemoveImportedFile(_event: ElectronEvent, args: { index: number }) {
    const { index } = args;
    this._configManager.removeImportedFileAtIndex(index);
  }

  onConfigRemoveAllImportedFiles() {
    this._configManager.resetImportedFiles();
  }

  async onConfigPlaylists() {
    const playlists = this._configManager.playlists;
    playlists?.forEach((playlist, index) => {
      for (let i = 0; i < playlist.files.length; i++) {
        if (!fs.existsSync(playlist.files[i])) {
          this._configManager.removeFileFromPlaylistAtIndex(i, index);
        }
      }
    });
    return this._configManager.playlists;
  }

  async onConfigValidatePlaylistName(
    _event: ElectronEvent,
    args: { name: string }
  ) {
    const { name } = args;
    const playlists = this._configManager.playlists;
    if (playlists) {
      return playlists.filter((p) => p.name === name).length === 0;
    }
    return false;
  }

  onConfigCreatePlaylist(_event: ElectronEvent, args: { name: string }) {
    const { name } = args;
    const playlist = {
      name,
      files: [],
    } as Playlist;
    this._configManager.addPlaylist(playlist);
  }

  onConfigDeletePlaylistAtIndex(
    _event: ElectronEvent,
    args: { index: number }
  ) {
    const { index } = args;
    this._configManager.deletePlaylistAtIndex(index);
  }

  onConfigAddFileToPlaylist(
    _event: ElectronEvent,
    args: { filename: string; playlist: string }
  ) {
    const { filename, playlist } = args;
    this._configManager.addFileToPlaylist(filename, playlist);
  }

  onConfigRemoveFileFromPlaylist(
    _event: ElectronEvent,
    args: { fileIndex: number; playlist: string }
  ) {
    const { fileIndex, playlist } = args;
    this._configManager.removeFileFromPlaylist(fileIndex, playlist);
  }
}

export default WavKit;

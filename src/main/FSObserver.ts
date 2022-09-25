import chokidar from 'chokidar';
import { BrowserWindow } from 'electron';

class FSObserver {
  private _watcher: chokidar.FSWatcher;
  
  constructor(path: string, window: BrowserWindow) {
    this._watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });
    
    this._watcher
      .on('add', makeOnFileAdded(window))
      .on('addDir', makeOnDirAdded(window));
  }

  async close() {
    await this._watcher.close();
  }
}

function makeOnFileAdded(window: BrowserWindow) {
  return (path: string) => {
    window.webContents.send('observer:file-added', { path });
  };
}

function makeOnDirAdded(window: BrowserWindow) {
  return (path: string) => {
    window.webContents.send('observer:dir-added', { path });
  };
}

export default FSObserver;
import { ipcRenderer } from 'electron';

export function addOnFileAddedHandler(handler: Function) {
  ipcRenderer.on('observer:file-added', (event: Event,  args: { path: string} ) => {
    const { path } = args;
    handler(path);
  });
}

export function addOnDirAddedHandler(handler: Function) {
  ipcRenderer.on('observer:dir-added', (event: Event, args: { path: string}) => {
    const { path } = args;
    handler(path);
  });
}
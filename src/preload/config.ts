import { ipcRenderer } from "electron";

export async function importedFiles() {
  return await ipcRenderer.invoke("config:imported-files");
}

export function addImportedFile(path: string) {
  ipcRenderer.send("config:add-imported-file", { path });
}

export function removeImportedFile(index: number) {
  ipcRenderer.send("config:remove-imported-file", { index });
}

export function removeAllImportedFiles() {
  ipcRenderer.send("config:remove-all-imported-files");
}

export async function playlists() {
  return await ipcRenderer.invoke("config:playlists");
}

export async function validatePlaylistName(name: string) {
  return await ipcRenderer.invoke("config:validate-playlist-name", { name });
}

export function createPlaylist(name: string) {
  ipcRenderer.send("config:create-playlist", { name });
}

export function deletePlaylistAtIndex(index: number) {
  ipcRenderer.send("config:delete-playlist-at-index", { index });
}

export function addFileToPlaylist(filename: string, playlist: string) {
  ipcRenderer.send("config:add-file-to-playlist", { filename, playlist });
}

export function removeFileFromPlaylist(fileIndex: number, playlist: string) {
  ipcRenderer.send("config:remove-file-from-playlist", { fileIndex, playlist });
}

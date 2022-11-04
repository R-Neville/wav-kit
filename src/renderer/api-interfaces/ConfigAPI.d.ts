import Playlist from "../../shared/Playlist";

export default interface ConfigAPI {
  importedFiles: () => Promise<string[]>;
  addImportedFile: (path: string) => void;
  removeImportedFile: (index: number) => void;
  removeAllImportedFiles: () => void;
  playlists: () => Promise<Playlist[]>;
  validatePlaylistName: (name: string) => Promise<boolean>;
  createPlaylist: (name: string) => void;
}
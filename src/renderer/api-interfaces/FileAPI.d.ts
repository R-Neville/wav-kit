import FileStats from "../../shared/FileStats";

export default interface FileAPI {
  openFolder: (path: string) => void;
  closeFolder: () => void;
  readDir: (path: string) => Promise<string[]> | null;
  isInDir: (name: string, dir: string) => boolean;
  rename: (oldPath: string, newPath: string) => boolean;
  renameFolder: (oldPath: string, newPath: string) => boolean;
  createFolder: (path: string) => void;
  statsFromPath: (path: string) => Promise<FileStats | null>;
}

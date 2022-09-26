export default interface FileAPI {
  openFolder: (path: string) => void;
  closeFolder: () => void;
  isInDir: (name: string, dir: string) => boolean;
  rename: (oldPath: string, newPath: string) => boolean;
  renameFolder: (oldPath: string, newPath: string) => boolean;
  createFolder: (path: string) => void;
}
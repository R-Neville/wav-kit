export default interface DialogAPI {
  showErrorMessage: (message: string) => void;
  showOpenFolderDialog: () => Promise<string|null>;
  showOpenFileDialog: () => Promise<string|null>;
  showOpenFilesDialog: () => Promise<string[]|null>;
}
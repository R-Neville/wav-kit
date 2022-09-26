export default interface DialogAPI {
  showOpenFolderDialog: () => Promise<string|null>;
}
export default interface ConfigAPI {
  importedFiles: () => Promise<string[]>;
  addImportedFile: (path: string) => void;
  removeImportedFile: (index: number) => void;
}
export default interface FileAPI {
  openFolder: (path: string) => void;
  isInDir: (name: string, dir: string) => boolean;
}
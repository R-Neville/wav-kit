export default interface PathAPI {
  extname: (filename: string) => string;
  basename: (filename: string) => string;
  dirname: (filename: string) => string;
  resolve: (...filenames: string[]) => string;
  isSubDir: (parent: string, dir: string) => boolean;
}

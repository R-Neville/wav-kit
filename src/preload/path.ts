import path from 'path';

export function extname(filename: string) {
  return path.extname(filename);
}

export function basename(filename: string) {
  return path.basename(filename);
}

export function dirname(filename: string) {
  return path.dirname(filename);
}

export function resolve(...filenames: string[]) {
  return path.resolve(...filenames);
}

export function isSubDir(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
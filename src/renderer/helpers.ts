import DirItem from './components/SidePanel/DirItem';
import DirTree from './components/SidePanel/DirTree';
import FileItem from './components/SidePanel/FileItem';

export function applyStyles(el: HTMLElement, styles: CSSStyleDeclaration) {
  for (let prop in styles) {
    el.style[prop] = styles[prop];
  }
}

export function collapseAll(dirItemList: DirItem[]) {
  for (let dirItem of dirItemList) {
    if (dirItem.dirItems.length > 0) {
      collapseAll(dirItem.dirItems);
    }
    dirItem.collapse();
  }
}

export function sortDirItems(dirItems: DirItem[]) {
  dirItems.sort((a, b) => {
    return a.path.localeCompare(b.path);
  });
}

export function sortFileItems(fileItems: FileItem[]) {
  fileItems.sort((a, b) => {
    return a.path.localeCompare(b.path);
  });
}

export function getOldDirItem(name: string, dirItems: DirItem[]) {
  const found = dirItems.filter(d => d.renamed && d.newName === name);
  return found[0] ? found[0] : null;
}

export function getOldFileItem(name: string, fileItems: FileItem[]) {
  const found = fileItems.filter(f => f.renamed && f.newName === name);
  return found[0] ? found[0] : null;
}

export function findParentDirItem(dirPath: string, list: DirItem[]) : DirItem | null {
  for (const node of list) {
    if (node.path === dirPath) {
      return node;
    } else if (window.api.path.isSubDir(node.path, dirPath)) {
      return findParentDirItem(dirPath, node.dirItems);
    }
  }
  return null;
}

export function insertDirInDirTree(dirItem: DirItem, dirTree: DirTree) {
  dirTree.dirItems.push(dirItem);
  if (dirTree.rendered) {
    dirTree.organise();
  } else {
    sortDirItems(dirTree.dirItems);
  }
}

export function insertDirInDirItem(dirItem: DirItem, parentDirItem: DirItem) {
  parentDirItem.dirItems.push(dirItem);
  if (parentDirItem.rendered || parentDirItem.expanded) {
    parentDirItem.organise();
  } else {
    sortDirItems(parentDirItem.dirItems);
  }
}

export function insertFileInDirTree(fileItem: FileItem, dirTree: DirTree) {
  dirTree.fileItems.push(fileItem);
  if (dirTree.rendered) {
    dirTree.organise();
  } else {
    sortFileItems(dirTree.fileItems);
  }
}

export function insertFileInDirItem(fileItem: FileItem, dirItem: DirItem) {
  dirItem.fileItems.push(fileItem);
  if (dirItem.rendered) {
    dirItem.organise();
  } else {
    sortFileItems(dirItem.fileItems);
  }
}

export function handleDirRenamedInDirTree(newDir: DirItem, oldDir: DirItem, dirTree: DirTree) {
  const index = dirTree.dirItems.indexOf(oldDir);
  dirTree.dirItems.splice(index, 1);
  dirTree.replaceChild(newDir, oldDir);
  if (oldDir.expanded) newDir.expand();
  dirTree.dirItems.splice(index, 0, newDir);
}

export function handleDirRenamedInDirItem(newDir: DirItem, oldDir: DirItem, parent: DirItem) {
  const index = parent.dirItems.indexOf(oldDir);
  parent.dirItems.splice(index, 1);
  parent.itemList.replaceChild(newDir, oldDir);
  if (oldDir.expanded) newDir.expand();
  parent.dirItems.splice(index, 0, newDir);
}

export function handleFileRenamedInDirTree(newFile: FileItem, oldFile: FileItem, dirTree: DirTree) {
  const index = dirTree.fileItems.indexOf(oldFile);
  dirTree.fileItems.splice(index, 1);
  dirTree.replaceChild(newFile, oldFile);
  dirTree.fileItems.splice(index, 0, newFile);
}

export function handleFileRenamedInDirItem(newFile: FileItem, oldFile: FileItem, parent: DirItem) {
  const index = parent.fileItems.indexOf(oldFile);
  parent.fileItems.splice(index, 1);
  parent.itemList.replaceChild(newFile, oldFile);
  parent.fileItems.splice(index, 0, newFile);
}
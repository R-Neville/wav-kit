import {
  applyStyles,
  findParentDirItem,
  getOldDirItem,
  getOldFileItem,
  handleDirRenamedInDirItem,
  handleDirRenamedInDirTree,
  handleFileRenamedInDirItem,
  handleFileRenamedInDirTree,
  insertDirInDirItem,
  insertDirInDirTree,
  insertFileInDirItem,
  insertFileInDirTree,
  sortDirItems,
  sortFileItems,
} from "../../helpers";
import DirItem from "./DirItem";
import FileItem from "./FileItem";

class DirTree extends HTMLElement {
  private _path: string;
  private _rendered: boolean;
  private _dirItems: DirItem[];
  private _fileItems: FileItem[];

  constructor(path: string) {
    super();

    this._path = path;
    this._rendered = false;
    this._dirItems = [];
    this._fileItems = [];

    applyStyles(this, {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderLeft: `0.5px solid ${window.theme.fgPrimary}`,
      marginLeft: "10px",
    } as CSSStyleDeclaration);

    this.addEventListener("file-deleted", this.onFileDeleted as EventListener);
    this.addEventListener(
      "folder-deleted",
      this.onFolderDeleted as EventListener
    );
  }

  get rendered() {
    return this._rendered;
  }

  get dirItems() {
    return this._dirItems;
  }

  get fileItems() {
    return this._fileItems;
  }

  addDirItem(dirItem: DirItem) {
    if (dirItem.path === this._path) return;
    const parentDirName = window.api.path.dirname(dirItem.path);
    const isInRoot = parentDirName === this._path;
    if (isInRoot) {
      const renamedDirItem = getOldDirItem(dirItem.path, this._dirItems);
      if (renamedDirItem) {
        handleDirRenamedInDirTree(dirItem, renamedDirItem, this);
        this.organise();
      } else {
        insertDirInDirTree(dirItem, this);
      }
    } else {
      const parentDirItem = findParentDirItem(parentDirName, this._dirItems);
      if (parentDirItem) {
        const renamedDirItem = getOldDirItem(
          dirItem.path,
          parentDirItem.dirItems
        );
        if (renamedDirItem) {
          handleDirRenamedInDirItem(dirItem, renamedDirItem, parentDirItem);
          parentDirItem.organise();
        } else {
          insertDirInDirItem(dirItem, parentDirItem);
        }
      }
    }
  }

  addFileItem(fileItem: FileItem) {
    const dirName = window.api.path.dirname(fileItem.path);
    const isInRoot = dirName === this._path;
    if (isInRoot) {
      const renamedFileItem = getOldFileItem(fileItem.path, this._fileItems);
      if (renamedFileItem) {
        handleFileRenamedInDirTree(fileItem, renamedFileItem, this);
        this.organise();
      } else {
        insertFileInDirTree(fileItem, this);
      }
    } else {
      const parentDirItem = findParentDirItem(dirName, this._dirItems);
      if (parentDirItem) {
        const renamedFileItem = getOldFileItem(
          fileItem.path,
          parentDirItem.fileItems
        );
        if (renamedFileItem) {
          handleFileRenamedInDirItem(fileItem, renamedFileItem, parentDirItem);
          parentDirItem.organise();
        } else {
          insertFileInDirItem(fileItem, parentDirItem);
        }
      }
    }
  }

  organise() {
    this._dirItems.forEach((d) => d.remove());
    this._fileItems.forEach((f) => f.remove());
    sortDirItems(this._dirItems);
    sortFileItems(this._fileItems);
    this._dirItems.forEach((d) => this.appendChild(d));
    this._fileItems.forEach((f) => this.appendChild(f));
  }

  expandPathTo(path: string) {
    this.expandRecursively(this._dirItems, path);
  }

  renderContents() {
    this._dirItems.forEach((di) => {
      this.appendChild(di);
    });
    this._fileItems.forEach((fi) => {
      this.appendChild(fi);
    });
    this._rendered = true;
  }

  private expandRecursively(dirItems: DirItem[], path: string) {
    for (let dir of dirItems) {
      if (window.api.path.isSubDir(dir.path, path)) {
        dir.expand();
        this.expandRecursively(dir.dirItems, path);
        break;
      }
    }
  }

  private onFileDeleted(event: CustomEvent) {
    const { filename } = event.detail;
    const index = this.getFileItemIndexFromName(filename);
    if (index >= 0) {
      const fileItem = this._fileItems.splice(index, 1)[0];
      fileItem.remove();
    }
  }

  private onFolderDeleted(event: CustomEvent) {
    const { path } = event.detail;
    const index = this.getDirItemIndexFromPath(path);
    if (index >= 0) {
      const dirItem = this._dirItems.splice(index, 1)[0];
      dirItem.remove();
    }
  }

  private getFileItemIndexFromName(filename: string) {
    const found = this._fileItems.filter((f) => f.path === filename);
    return found.length > 0 ? this._fileItems.indexOf(found[0]) : -1;
  }

  private getDirItemIndexFromPath(path: string) {
    const found = this._dirItems.filter((d) => d.path === path);
    return found.length > 0 ? this._dirItems.indexOf(found[0]) : -1;
  }
}

customElements.define("dir-tree", DirTree);

export default DirTree;

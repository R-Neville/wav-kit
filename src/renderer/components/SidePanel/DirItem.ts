import {
  applyStyles,
  sortDirItems,
  sortFileItems,
  collapseAll,
} from "../../helpers";
import ContextMenu from "../shared/ContextMenu";
import DropdownExpander from "./DropdownExpander";
import FileItem from "./FileItem";
import Modal from "../shared/Modal";

class DirItem extends HTMLElement {
  private _rendererd: boolean;
  private _expanded: boolean;
  private _path: string;
  private _renamed: boolean;
  private _newName: string | null;
  private _expander: DropdownExpander;
  private _itemList: HTMLDivElement;
  private _dirItems: DirItem[];
  private _fileItems: FileItem[];
  private _contextMenu: ContextMenu | null;

  constructor(path: string) {
    super();

    this._rendererd = false;
    this._expanded = false;
    this._path = path;
    this._renamed = false;
    this._newName = null;
    this._expander = new DropdownExpander(window.api.path.basename(this._path));
    this._itemList = this.buildItemList();
    this._dirItems = [];
    this._fileItems = [];
    this._contextMenu = null;

    this.appendChild(this._expander);
    this.appendChild(this._itemList);

    this.addEventListener(
      "expander-clicked",
      this.onExpanderClicked as EventListener
    );
    this.addEventListener(
      "expander-right-clicked",
      this.onExpanderRightClicked as EventListener
    );
  }

  get expanded() {
    return this._expanded;
  }

  get path() {
    return this._path;
  }

  set path(newValue: string) {
    this._path = newValue;
  }

  get renamed() {
    return this._renamed;
  }

  get newName() {
    return this._newName;
  }

  get itemList() {
    return this._itemList;
  }

  get dirItems() {
    return this._dirItems;
  }

  set dirItems(newItems: DirItem[]) {
    this._dirItems = newItems;
  }

  get fileItems() {
    return this._fileItems;
  }

  set fileItems(newItems: FileItem[]) {
    this._fileItems = newItems;
  }

  expand() {
    if (!this._expanded) {
      if (!this._rendererd) {
        this._rendererd = true;
        this.renderContents();
      }
      this._expander.expand();
      this._itemList.style.display = "flex";
      this._expanded = true;
    }
  }

  collapse() {
    if (this._expanded) {
      this._expander.close();
      this._itemList.style.display = "none";
      this._expanded = false;
    }
  }

  organise() {
    this._dirItems.forEach((d) => d.remove());
    this._fileItems.forEach((f) => f.remove());
    sortDirItems(this._dirItems);
    sortFileItems(this._fileItems);
    this._dirItems.forEach((d) => this._itemList.appendChild(d));
    this._fileItems.forEach((f) => this._itemList.appendChild(f));
  }

  private buildItemList() {
    const itemList = document.createElement("div");
    applyStyles(itemList, {
      display: "flex",
      flexDirection: "column",
      borderLeft: `0.5px solid ${window.theme.fgPrimary}`,
      marginLeft: "10px",
    } as CSSStyleDeclaration);
    return itemList;
  }

  private renderContents() {
    this._dirItems.forEach((di) => {
      this._itemList.appendChild(di);
    });
    this._fileItems.forEach((fi) => {
      this._itemList.appendChild(fi);
    });
  }

  private onExpanderClicked(event: CustomEvent) {
    if (this !== (event.target as HTMLElement).parentElement) {
      return;
    }

    if (this._expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private onExpanderRightClicked(event: CustomEvent) {
    event.stopPropagation();

    if (this._contextMenu) {
      this._contextMenu.remove();
      this._contextMenu = null;
    }
    const { x, y } = event.detail;
    this._contextMenu = this.buildContextMenu();
    document.body.appendChild(this._contextMenu);
    this._contextMenu.show(x, y);
  }

  private buildContextMenu(): ContextMenu {
    const menu = new ContextMenu();
    menu.addOption("Collapse All", this.collapseAll.bind(this));
    menu.addOption("New Folder", this.showNewFolderModal.bind(this));
    menu.addOption("Rename", this.showRenameFolderModal.bind(this));
    return menu;
  }

  private collapseAll() {
    collapseAll(this._dirItems);
    this.collapse();
    this._contextMenu?.remove();
    this._contextMenu = null;
  }

  private showNewFolderModal() {
    const modal = new Modal("Enter the new folder's name:");
    modal.addInput((event) => {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      if (value.length === 0) {
        modal.lock();
        return;
      }
      if (value.length > 255) {
        modal.lock();
        return;
      }
      if (!value.match(/^[a-zA-Z0-9._]{1}[a-zA-Z0-9._()-]*$/)) {
        modal.lock();
        return;
      }
      if (value === "." || value === "..") {
        modal.lock();
        return;
      }
      if (window.api.file.isInDir(value, window.api.path.dirname(this._path))) {
        modal.lock();
        return;
      }

      modal.unlock();
    }, "");

    const onNewFolderModalCancel = (event: Event) => {
      modal.remove();
    };

    const onNewFolderModalConfirm = (event: Event) => {
      if (!modal.valid) return;
      const folderName = modal.inputValue;
      if (folderName) {
        const fullPath = window.api.path.resolve(this._path, folderName);
        const customEvent = new CustomEvent("new-folder-requested", {
          bubbles: true,
          detail: {
            path: fullPath,
          },
        });
        this.dispatchEvent(customEvent);
        modal.remove();
      }
    };

    modal.addAction("Cancel", onNewFolderModalCancel);

    modal.addAction("Confirm", onNewFolderModalConfirm.bind(this));

    document.body.appendChild(modal);
  }

  private showRenameFolderModal() {
    const modal = new Modal("Enter the new folder's name:");
    modal.addInput((event) => {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      if (value.length === 0) {
        modal.lock();
        return;
      }
      if (value.length > 255) {
        modal.lock();
        return;
      }
      if (!value.match(/^[a-zA-Z0-9._]{1}[a-zA-Z0-9._()-]*$/)) {
        modal.lock();
        return;
      }
      if (value === "." || value === "..") {
        modal.lock();
        return;
      }
      if (window.api.file.isInDir(value, window.api.path.dirname(this._path))) {
        modal.lock();
        return;
      }

      modal.unlock();
    }, window.api.path.basename(this._path));

    const onRenameFolderModalCancel = (event: Event) => {
      modal.remove();
    };

    const onRenameFolderModalConfirm = (event: Event) => {
      if (!modal.valid) return;
      const newName = modal.inputValue;
      if (newName) {
        const parentDir = window.api.path.dirname(this._path);
        const newPath = window.api.path.resolve(parentDir, newName);
        const success = window.api.file.renameFolder(this._path, newPath);
        if (success) {
          this._renamed = true;
          this._newName = newPath;
        }
        modal.remove();
      }
    };

    modal.addAction("Cancel", onRenameFolderModalCancel);

    modal.addAction("Confirm", onRenameFolderModalConfirm.bind(this));

    document.body.appendChild(modal);
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

customElements.define("dir-item", DirItem);

export default DirItem;

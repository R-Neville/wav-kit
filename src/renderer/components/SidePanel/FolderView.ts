import { applyStyles, collapseAll } from "../../helpers";
import universalStyles from "../../universalStyles";
import ScrollView from "../shared/ScrollView";
import DropdownExpander from "./DropdownExpander";
import DirTree from "./DirTree";
import DirItem from "./DirItem";
import FileItem from "./FileItem";
import ContextMenu from "../shared/ContextMenu";
import Modal from "../shared/Modal";

class FolderView extends HTMLElement {
  private _path: string;
  private _expanded: boolean;
  private _expander: DropdownExpander;
  private _dirTree: DirTree;
  private _scrollView: ScrollView;
  private _contextMenu: ContextMenu | null;

  constructor(path: string) {
    super();

    this._path = path;
    this._expanded = false;
    this._expander = new DropdownExpander(window.api.path.basename(this._path));
    this._dirTree = new DirTree(this._path);
    this._scrollView = new ScrollView();
    this._scrollView.addVerticalScrollBar(this._dirTree, 8);
    this._scrollView.setContent(this._dirTree);
    this._scrollView.hide();
    this._contextMenu = null;

    this.appendChild(this._expander);
    this.appendChild(this._scrollView);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxHeight: "calc(100% - 20px)",
    } as CSSStyleDeclaration);

    this.addEventListener(
      "expander-clicked",
      this.onExpanderClicked as EventListener
    );
    this.addEventListener(
      "expander-right-clicked",
      this.onExpanderRightClicked as EventListener
    );
  }

  addDir(path: string) {
    const dirItem = new DirItem(path);
    this._dirTree.addDirItem(dirItem);
  }

  addFile(path: string) {
    const fileItem = new FileItem(path);
    this._dirTree.addFileItem(fileItem);
  }

  private onExpanderClicked(event: CustomEvent) {
    if (this !== (event.target as HTMLElement).parentElement) {
      return;
    }

    if (this._expanded) {
      this._scrollView.hide();
    } else {
      this.expandDirTree();
    }
    this._expanded = !this._expanded;
  }

  private expandDirTree() {
    const dirTreeContents =
      this._dirTree.dirItems.length + this._dirTree.fileItems.length;
    if (this._dirTree.children.length === 0 && dirTreeContents > 0) {
      this._dirTree.renderContents();
    }
    this._scrollView.show();
  }

  private onExpanderRightClicked(event: CustomEvent) {
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
    menu.addOption("Close", this.onCloseContextMenuOptionClick.bind(this));
    return menu;
  }

  private collapseAll() {
    collapseAll(this._dirTree.dirItems);
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
      if (window.api.file.isInDir(value, this._path)) {
        modal.lock();
        return;
      }

      modal.unlock();
    }, "");

    const onNewFolderModalCancel = () => {
      modal.remove();
    };

    const onNewFolderModalConfirm = () => {
      if (!modal.valid) return;
      const folderName = modal.inputValue;
      if (folderName) {
        const fullPath = window.api.path.resolve(this._path, folderName);
        window.api.file.createFolder(fullPath);
        modal.remove();
      }
    };

    modal.addAction("Cancel", onNewFolderModalCancel);

    modal.addAction("Confirm", onNewFolderModalConfirm.bind(this));

    document.body.appendChild(modal);
  }

  private onCloseContextMenuOptionClick() {
    window.api.file.closeFolder();
    const customEvent = new CustomEvent("folder-closed", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("folder-view", FolderView);

export default FolderView;

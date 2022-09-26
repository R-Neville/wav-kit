import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import ContextMenu from "../shared/ContextMenu";
import Modal from "../shared/Modal";

class FileItem extends HTMLElement {
  private _path: string;
  private _renamed: boolean;
  private _newName: string | null;
  private _label: HTMLLabelElement;
  private _contextMenu: ContextMenu | null;

  constructor(path: string) {
    super();

    this._path = path;
    this._renamed = false;
    this._newName = null;
    this._label = document.createElement("label");
    this._label.textContent = window.api.path.basename(this._path);
    this._contextMenu = null;

    this.appendChild(this._label);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      padding: "5px",
      width: "100%",
      backgroundColor: "inherit",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    applyStyles(this._label, {
      ...universalStyles,
      overflow: "hidden",
      paddingLeft: "4px",
      minWidth: "100px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "14px",
      textOverflow: "ellipsis",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);

    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener('contextmenu', this.onContextMenu);
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

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }

  private onMouseLeave() {
    this.style.backgroundColor = "inherit";
  }

  private onContextMenu(event: MouseEvent) {
    event.stopPropagation();

    if (this._contextMenu) {
      this._contextMenu.remove();
      this._contextMenu = null;
    }
    this._contextMenu = this.buildContextMenu();
    document.body.appendChild(this._contextMenu);
    this._contextMenu.show(event.pageX, event.pageY);
  }

  private buildContextMenu() : ContextMenu {
    const menu = new ContextMenu();
    menu.addOption('Rename', this.showRenameFileModal.bind(this));
    return menu;
  }

  private showRenameFileModal() {
    const modal = new Modal("Enter the file's new name:");
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

    const onRenameFileModalCancel = (event: Event) => {
      modal.remove();
    };

    const onRenameFileModalConfirm = (event: Event) => {
      if (!modal.valid) return;
      const newName = modal.inputValue;
      if (newName) {
        const parentDir = window.api.path.dirname(this._path);
        const newPath = window.api.path.resolve(parentDir, newName);
        const success = window.api.file.rename(this._path, newPath);
        if (success) {
          this._renamed = true;
          this._newName = newPath;
        }
        modal.remove();
      }
    };

    modal.addAction("Cancel", onRenameFileModalCancel);

    modal.addAction("Confirm", onRenameFileModalConfirm.bind(this));

    document.body.appendChild(modal);
  }
}

customElements.define("file-item", FileItem);

export default FileItem;

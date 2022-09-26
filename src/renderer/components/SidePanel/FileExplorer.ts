import { FileInfo } from ".";
import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import FolderView from "./FolderView";

class FileExplorer extends HTMLElement {
  private _visible: boolean;
  private _currentFolder: string|null;
  private _heading: HTMLHeadingElement;
  private _openFolderButton: HTMLButtonElement;
  private _folderView: FolderView|null;

  constructor() {
    super();

    this._visible = false;
    this._currentFolder = null;
    this._heading = this.buildHeading();
    this._openFolderButton = this.buildOpenFolderButton();
    this._folderView = null;

    this.appendChild(this._heading);
    this.appendChild(this._openFolderButton);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);

    this.addEventListener("folder-closed", this.onFolderClosed);
  }

  get visible() {
    return this._visible;
  }

  show() {
    this._visible = true;
    this.style.display = "flex";
  }

  hide() {
    this._visible = false;
    this.style.display = "none";
  }

  addFile(fileInfo: FileInfo) {
    if (this._folderView) {
      if (fileInfo.dir) {
        this._folderView.addDir(fileInfo.path);
      } else {
        this._folderView.addFile(fileInfo.path);
      }
    }
  }

  private buildHeading() {
    const heading = document.createElement("h1");
    heading.textContent = "EXPLORER";
    applyStyles(heading, {
      padding: "5px",
      margin: "0",
      textAlign: "center",
      fontSize: "1em",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
    return heading;
  }

  private buildOpenFolderButton() {
    const button = document.createElement("button");
    button.textContent = "Open Folder";
    applyStyles(button, {
      ...universalStyles,
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      margin: "1em",
      backgroundColor: window.theme.bgHighlight,
      fontSize: "1em",
      color: window.theme.fgHighlight,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    button.addEventListener("click", async () => {
      const response = await window.api.dialog.showOpenFolderDialog();
      if (response !== null) {
        button.style.display = "none";
        this._currentFolder = response;
        if (this._folderView) {
          this._folderView.remove();
          this._folderView = null;
        }
        this._folderView = new FolderView(this._currentFolder);
        this.appendChild(this._folderView);
        window.api.file.openFolder(this._currentFolder);
      }
    });
    return button;
  }

  private onFolderClosed() {
    this._folderView?.remove();
    this._folderView = null;
    this._openFolderButton.style.display = "block";
  }
}

customElements.define("file-explorer", FileExplorer);

export default FileExplorer;
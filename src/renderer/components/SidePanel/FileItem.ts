import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class FileItem extends HTMLElement {
  private _path: string;
  private _renamed: boolean;
  private _newName: string | null;
  private _label: HTMLLabelElement;

  constructor(path: string) {
    super();

    this._path = path;
    this._renamed = false;
    this._newName = null;
    this._label = document.createElement("label");
    this._label.textContent = window.api.path.basename(this._path);

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
}

customElements.define("file-item", FileItem);

export default FileItem;

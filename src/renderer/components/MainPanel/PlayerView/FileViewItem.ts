import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class FileViewItem extends HTMLElement {
  private _path: string;
  private _nameLabel: HTMLLabelElement;
  private _sizeLabel: HTMLLabelElement;

  constructor(stats: FileStats) {
    super();
    
    this._path = stats.path;
    this.title = this._path;
    this._nameLabel = this.buildLabel(window.api.path.basename(this._path));
    this._sizeLabel = this.buildLabel(`${stats.mb}MB`);

    this.appendChild(this._nameLabel);
    this.appendChild(this._sizeLabel);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      overflow: "hidden",
      padding: "10px",
      margin: "5px",
      backgroundColor: window.theme.bgHighlight,
      whiteSpace: "no-wrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  private buildLabel(text: string) {
    const label = document.createElement("label");
    label.textContent = text;
    applyStyles(label, {
      ...universalStyles,
      overflow: "hidden",
      whiteSpace: "no-wrap",
      textOverflow: "ellipsis",
      fontSize: "1em",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    return label;
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgAccent;
  }

  private onMouseLeave() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }
}

customElements.define("file-list-item", FileViewItem);

export default FileViewItem;
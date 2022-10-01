import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import { close } from "../../../icons";
import universalStyles from "../../../universalStyles";
import Icon from "../../shared/Icon";

class FileViewItem extends HTMLElement {
  private _path: string;
  private _nameLabel: HTMLLabelElement;
  private _sizeLabel: HTMLLabelElement;
  private _closeButton: HTMLButtonElement;

  constructor(stats: FileStats) {
    super();
    
    this._path = stats.path;
    this._nameLabel = this.buildLabel(window.api.path.basename(this._path));
    this._nameLabel.style.marginRight = "auto";
    this._nameLabel.title = this._path;
    this._sizeLabel = this.buildLabel(`${stats.mb}MB`);
    this._closeButton = this.buildCloseButton();

    this.appendChild(this._nameLabel);
    this.appendChild(this._sizeLabel);
    this.appendChild(this._closeButton);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      padding: "10px",
      backgroundColor: window.theme.bgHighlight,
      whiteSpace: "no-wrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    applyStyles(this._nameLabel, {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    } as CSSStyleDeclaration);

    this.addEventListener("dblclick", this.onDblClick);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  get path() {
    return this._path;
  }

  private buildLabel(text: string) {
    const label = document.createElement("label");
    label.textContent = text;
    applyStyles(label, {
      ...universalStyles,
      fontSize: "14px",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    return label;
  }

  private buildCloseButton() {
    const button = document.createElement("button");
    const icon = new Icon(close(), "100%", true);
    icon.setColor(window.theme.fgHighlight);
    button.appendChild(icon);
    applyStyles(button, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "20px",
      height: "20px",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      marginLeft: "5px",
      backgroundColor: "inherit",
      cursor: "pointer",
    } as CSSStyleDeclaration);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("clear-item", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = window.theme.bgAccent;
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "inherit";
    });
    return button;
  }

  private onDblClick() {
    const customEvent = new CustomEvent("item-dbl-clicked", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgAccent + "55";
  }

  private onMouseLeave() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }
}

customElements.define("file-list-item", FileViewItem);

export default FileViewItem;
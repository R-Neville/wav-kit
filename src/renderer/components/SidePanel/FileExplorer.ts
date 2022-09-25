import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class FileExplorer extends HTMLElement {
  private _visible: boolean;
  private _heading: HTMLHeadingElement;

  constructor() {
    super();

    this._visible = false;

    this._heading = this.buildHeading();

    this.appendChild(this._heading);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);
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
}

customElements.define("file-explorer", FileExplorer);

export default FileExplorer;
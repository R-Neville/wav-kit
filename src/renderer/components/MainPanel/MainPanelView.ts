import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import DotMenu from "../shared/DotMenu";

export default class MainPanelView extends HTMLElement {
  protected _header: HTMLDivElement;
  protected _body: HTMLDivElement;
  protected _menu: DotMenu | null;

  constructor(title: string) {
    super();

    this._header = this.buildHeader(title);
    this._body = document.createElement("div");
    this._menu = null;

    this.appendChild(this._header);
    this.appendChild(this._body);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content 1fr",
      overflow: "hidden",
      width: "100%",
      maxHeight: "100%",
      backgroundColor: window.theme.bgPrimary,
    } as CSSStyleDeclaration);
  }

  protected addMenu() {
    this._menu = new DotMenu();
    this._header.appendChild(this._menu);
  }

  private buildHeader(title: string) {
    const header = document.createElement("div");
    applyStyles(header, {
      ...universalStyles,
      display: "flex",
      padding: "1em",
    } as CSSStyleDeclaration);
    
    const heading = document.createElement("h1");
    heading.textContent = title;
    applyStyles(heading, {
      ...universalStyles,
      padding: "0",
      margin: "0",
      marginRight: "auto",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
    header.appendChild(heading);

    return header;
  }
}
import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

export default class MainPanelView extends HTMLElement {
  protected _header: HTMLDivElement;
  protected _body: HTMLDivElement;

  constructor(title: string) {
    super();

    this._header = this.buildHeader(title);
    this._body = document.createElement("div");

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

  protected addHeaderAction(text: string, onClick: EventListener) {
    const action = this.buildAction(text, onClick);
    this._header.appendChild(action);
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

  private buildAction(text: string, onClick: EventListener) {
    const action = document.createElement("button");
    action.textContent = text;
    applyStyles(action, {
      ...universalStyles,
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      marginLeft: "5px",
      backgroundColor: window.theme.bgHighlight,
      fontSize: "1em",
      color: window.theme.fgHighlight,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    action.addEventListener("click", onClick);
    return action;
  }
}
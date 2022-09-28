import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Icon from "../../shared/Icon";

class MenuBarAction extends HTMLElement {
  private _active: boolean;
  private _icon: Icon;

  constructor(icon: Icon, onClick: EventListener) {
    super();

    this._active = false;
    this._icon = icon;

    this.appendChild(this._icon);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "50px",
      backgroundColor: "inherit",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
    this.addEventListener("click", this.onClick);
  }

  get active() {
    return this._active;
  }

  highlight() {
    this._active = true;
    this.style.backgroundColor = window.theme.bgAccent;
  }

  unhighlight() {
    this._active = false;
    this.style.backgroundColor = "inherit";
  }

  private onClick() {
    const customEvent = new CustomEvent("action-clicked", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("menu-bar-action", MenuBarAction);

export default MenuBarAction;
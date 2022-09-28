import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import Icon from "../shared/Icon";

class Action extends HTMLElement {
  private _icon: Icon;
  private _clicked: boolean;

  constructor(icon: Icon, onClick: EventListener) {
    super();

    this._icon = icon;
    this._clicked = false;

    this.appendChild(this._icon);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "50px",
      height: "50px",
      backgroundColor: "inherit",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
    this.addEventListener("click", this.onClick);
  }

  reset() {
    this._clicked = false;
  }

  private onClick() {
    if (this._clicked) {
      this._clicked = false;
      const customEvent = new CustomEvent("close-side-panel", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    } else {
      this._clicked = true;
      const customEvent = new CustomEvent("action-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    }
  }
}

customElements.define("side-bar-action", Action);

export default Action;
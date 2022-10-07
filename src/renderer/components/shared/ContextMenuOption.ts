import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class ContextMenuOption extends HTMLElement {

  constructor(text: string, action: EventListener) {
    super();

    this.textContent = text;

    applyStyles(this, {
      ...universalStyles,
      display: "block",
      padding: "5px",
      width: "100%",
      backgroundColor: "inherit",
      fontSize: "1em",
      color: "#000",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", action);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  private onMouseEnter() {
    this.style.backgroundColor = "#FFF";
  }

  private onMouseLeave() {
    this.style.backgroundColor = "inherit";
  }
}

customElements.define("context-menu-option", ContextMenuOption);

export default ContextMenuOption;
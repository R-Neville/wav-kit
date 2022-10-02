import { applyStyles } from "../../helpers";
import ContextMenuOption from "./ContextMenuOption";

class ContextMenu extends HTMLElement {
  constructor() {
    super();

    this.tabIndex = 100;

    applyStyles(this, {
      display: "none",
      flexDirection: "column",
      position: "absolute",
      zIndex: "99",
      minWidth: "200px",
      borderRadius: "3px",
      outline: "none",
      backgroundColor: "whitesmoke",
    } as CSSStyleDeclaration);

    
    this.addEventListener("click", () => {
      this.blur();
    });
    this.addEventListener("blur", () => {
      this.destroy();
    });
  }

  addOption(text: string, action: EventListener) {
    const option = new ContextMenuOption(text, action);
    this.appendChild(option);
  }

  show(x: number, y: number) {
    this.style.display = "flex";

    const { width, height } = this.getBoundingClientRect();

    if (x + width > window.innerWidth - width) {
      this.style.left = x - width + "px";
    } else {
      this.style.left = x + "px";
    }

    if (y + height > window.innerHeight - height) {
      this.style.left = y - height + "px";
    } else {
      this.style.top = y + "px";
    }

    this.focus();
  }

  destroy() {
    this.remove();
  }
}

customElements.define("context-menu", ContextMenu);

export default ContextMenu;

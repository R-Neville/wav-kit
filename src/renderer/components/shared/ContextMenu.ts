import { applyStyles } from "../../helpers";
import ContextMenuOption from "./ContextMenuOption";

class ContextMenu extends HTMLElement {
  constructor() {
    super();

    this.tabIndex = 100;

    applyStyles(this, {
      display: "none",
      position: "fixed",
      zIndex: "99",
      minWidth: "200px",
      borderRadius: "3px",
      outline: "none",
      backgroundColor: "#E5E8E8",
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
    this.style.display = "block";

    const { width, height } = this.getBoundingClientRect();

    if (x > document.body.clientWidth - width) {
      this.style.left = x - width + "px";
    } else {
      this.style.left = x + "px";
    }

    if (y > document.body.clientHeight - height) {
      this.style.top = y - height + "px";
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

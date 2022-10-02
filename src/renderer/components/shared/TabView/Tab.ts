import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class Tab extends HTMLElement {
  private _active: boolean;

  constructor(text: string, onClick: EventListener) {
    super();

    this.textContent = text;
    this._active = false;

    applyStyles(this, {
      ...universalStyles,
      padding: "0.5em 1em",
      borderRight: `1px solid ${window.theme.bgHighlight}`,
      backgroundColor: "transparent",
      fontSize: "1em",
      color: window.theme.fgHighlight,
      cursor: "pointer",
    } as CSSStyleDeclaration);
  
    this.addEventListener("click", onClick);
    this.addEventListener("click", () => {
      const customEvent = new CustomEvent("tab-clicked", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  get active() {
    return this._active;
  }

  activate() {
    this._active = true;
    this.style.backgroundColor = window.theme.bgHighlight;
  }

  deactivate() {
    this._active = false;
    this.style.backgroundColor = "transparent";
  }

  private onMouseEnter() {
    if (!this._active) {
      this.style.backgroundColor = window.theme.bgSecondary + "11";
    }
  }

  private onMouseLeave() {
    if (!this._active) {
      this.style.backgroundColor = "transparent";
    }
  }
}

customElements.define("tab-view-tab", Tab);

export default Tab;
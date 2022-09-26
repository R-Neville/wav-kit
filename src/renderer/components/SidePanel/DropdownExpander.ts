import { applyStyles } from "../../helpers";
import Icon from "../shared/Icon";
import { closed } from "../../icons";

class DropdownExpander extends HTMLElement {
  private _expanded: boolean;
  private _label: HTMLLabelElement;
  private _icon: Icon;

  constructor(text: string) {
    super();

    this._expanded = false;
    this._label = document.createElement("label");
    this._label.textContent = text;
    this._icon = new Icon(closed(), "10px", true);
    this._icon.setColor(window.theme.fgPrimary);

    this.appendChild(this._icon);
    this.appendChild(this._label);

    applyStyles(this, {
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      boxSizing: "border-box",
      paddingLeft: "5px",
      paddingRight: "5px",
      width: "100%",
      backgroundColor: "inherit",
      cursor: "pointer",
      userSelect: "none",
    } as CSSStyleDeclaration);

    applyStyles(this._label, {
      overflow: "hidden",
      padding: "5px",
      minWidth: "100px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      userSelect: "none",
      textOverflow: "ellipsis",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);

    this.addEventListener("click", this.onClick);
    this.addEventListener("contextmenu", this.onRightClick);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  close() {
    if (this._expanded) {
      this._expanded = false;
      this._icon.transform("rotate(0)");
    }
  }

  expand() {
    if (!this._expanded) {
      this._expanded = true;
      this._icon.transform("rotate(90)");
    }
  }

  private onClick() {
    if (this._expanded) {
      this._icon.transform("rotate(0)");
    } else {
      this._icon.transform("rotate(90)");
    }

    this._expanded = !this._expanded;

    const customEvent = new CustomEvent("expander-clicked", { bubbles: true });
    this.dispatchEvent(customEvent);
  }

  private onRightClick(event: MouseEvent) {
    const customEvent = new CustomEvent("expander-right-clicked", {
      bubbles: true,
      detail: {
        x: event.pageX,
        y: event.pageY,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }

  private onMouseLeave() {
    this.style.backgroundColor = "inherit";
  }
}

customElements.define("dropdown-expander", DropdownExpander);

export default DropdownExpander;

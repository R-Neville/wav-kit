import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";

class DotMenu extends HTMLElement {
  private _visible: boolean;
  private _menu: HTMLDivElement;

  constructor() {
    super();
    
    this.tabIndex = 100;
    this._visible = false;
    this._menu = this.buildMenu();

    this.appendChild(this.buildDot());
    this.appendChild(this.buildDot());
    this.appendChild(this.buildDot());
    this.appendChild(this._menu);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      position: "relative",
      padding: "4px",
      width: "30px",
      height: "30px",
      border: "1px solid transparent",
      borderRadius: "50%",
      outline: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", () => {
      if (!this._visible) {
        this._visible = true;
        this.style.backgroundColor = window.theme.bgSecondary + "44";
        this._menu.style.display = "flex";
        this.focus();
      } else {
        this.hideMenu();
      }
    });

    this.addEventListener("blur", () => {
      this.hideMenu();
      this.style.backgroundColor = "transparent";
    });

    this.addEventListener("mouseenter", () => {
      if (!this._visible) {
        this.style.backgroundColor = window.theme.bgSecondary + "44";
      }
    });

    this.addEventListener("mouseleave", () => {
      if (!this._visible) {
        this.style.backgroundColor = "transparent";
      }
    });
  }

  addOption(text: string, onClick: EventListener) {
    const option = document.createElement("div");
    option.textContent = text;
    applyStyles(option, {
      ...universalStyles,
      padding: "5px",
      backgroundColor: window.theme.bgSecondary + "44",
      fontSize: "14px",
      color: window.theme.fgPrimary,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    option.addEventListener("click", onClick);
    option.addEventListener("mouseenter", () => {
      option.style.backgroundColor = window.theme.bgSecondary + "33";
    });
    option.addEventListener("mouseleave", () => {
      option.style.backgroundColor = window.theme.bgSecondary + "44";
    });
    this._menu.appendChild(option);
  }

  private hideMenu() {
    if (this._visible) {
      this._visible = false;
      this._menu.style.display = "none";
    }
  }

  private buildDot() {
    const dot = document.createElement("div");
    applyStyles(dot, {
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
    return dot;
  }

  private buildMenu() {
    const menu = document.createElement("div");
    applyStyles(menu, {
      ...universalStyles,
      display: "none",
      flexDirection: "column",
      position: "absolute",
      top: "calc(100% + 3px)",
      right: "0px",
      width: "200px",
      outline: "none",
      backgroundColor: window.theme.bgPrimary,
    } as CSSStyleDeclaration);
    menu.addEventListener("click", (event) => {
      event.stopPropagation();
      this.hideMenu();
    });
    return menu;
  }
}

customElements.define("dot-menu", DotMenu);

export default DotMenu;
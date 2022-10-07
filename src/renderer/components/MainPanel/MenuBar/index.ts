import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Icon from "../../shared/Icon";
import MenuBarAction from "./MenuBarAction";

class MenuBar extends HTMLElement {
  private _actions: MenuBarAction[];
  constructor() {
    super();

    this._actions = [];

    applyStyles(this, {
      ...universalStyles,
      gridColumn: "2",
      gridRow: "1",
      display: "flex",
      flexDirection: "column",
      width: "50px",
      height: "100%",
      backgroundColor: window.theme.bgHighlight,
    } as CSSStyleDeclaration);

    this.addEventListener(
      "action-clicked",
      this.onActionClicked as EventListener
    );
  }

  addAction(icon: Icon, onClick: EventListener, active: boolean) {
    const action = new MenuBarAction(icon, onClick);
    this._actions.push(action);
    this.appendChild(action);
    if (active) action.highlight();
  }

  private onActionClicked(event: CustomEvent) {
    const target = event.target as MenuBarAction;
    this._actions.forEach((action) => {
      action.unhighlight();
    });
    target.highlight();
  }
}

customElements.define("menu-bar", MenuBar);

export default MenuBar;

import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import Icon from "../shared/Icon";
import Action from "./Action";

class SideBar extends HTMLElement {
  private _actions: Action[];

  constructor() {
    super();

    this._actions = [];

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      width: "50px",
      backgroundColor: window.theme.bgAccent,
    } as CSSStyleDeclaration);

    this.addEventListener("action-clicked", this.onActionClicked as EventListener);
  }

  addAction(icon: Icon, onClick: EventListener) {
    const action = new Action(icon, onClick);
    this._actions.push(action);
    this.appendChild(action);
  }

  private onActionClicked(event: CustomEvent) {
    event.stopPropagation();
    const action = event.target as Action;
    this._actions.forEach((a) => {
      if (a !== action) {
        a.reset();
      }
    });
  }
}

customElements.define("side-bar", SideBar);

export default SideBar;
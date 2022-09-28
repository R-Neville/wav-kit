import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Icon from "../../shared/Icon";

class Control extends HTMLElement {
  private _icon: Icon;

  constructor(icon: Icon, onClick: EventListener) {
    super();

    this._icon = icon;

    this.appendChild(this._icon);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      margin: "5px",
      backgroundColor: window.theme.bgSecondary,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", onClick);
  }
}

customElements.define("audio-player-control", Control);

export default Control;
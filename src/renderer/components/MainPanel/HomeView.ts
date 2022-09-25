import { applyStyles } from "../../helpers";
import { logo } from "../../icons";
import universalStyles from "../../universalStyles";
import Icon from "../shared/Icon";

class HomeView extends HTMLElement {
  private _logo: Icon;

  constructor() {
    super();

    this._logo = new Icon(logo(), "200px", true);
    this._logo.setColor(window.theme.bgHighlight);

    this.appendChild(this._logo);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
      width: "100%",
      height: "100%",
      backgroundColor: "inherit",
    } as CSSStyleDeclaration);
  }
}

customElements.define("home-view", HomeView);

export default HomeView;
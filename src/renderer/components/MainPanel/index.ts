import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import HomeView from "./HomeView";

class MainPanel extends HTMLElement {
  private _homeView: HomeView;

  constructor() {
    super();

    this._homeView = new HomeView();

    this.appendChild(this._homeView);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      backgroundColor: window.theme.bgSecondary,
    } as CSSStyleDeclaration);
  }
}

customElements.define("main-panel", MainPanel);

export default MainPanel;
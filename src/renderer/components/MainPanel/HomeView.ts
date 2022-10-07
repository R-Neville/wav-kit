import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import MainPanelView from "./MainPanelView";

class HomeView extends MainPanelView {
  constructor() {
    super("WavKit");

    applyStyles(this._body, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
    } as CSSStyleDeclaration);
  }
}

customElements.define("home-view", HomeView);

export default HomeView;
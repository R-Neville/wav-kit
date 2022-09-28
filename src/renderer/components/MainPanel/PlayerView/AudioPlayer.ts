import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Control from "./Control";
import { next, play, previous } from "../../../icons";
import Icon from "../../shared/Icon";

class AudioPlayer extends HTMLElement {
  private _controlsView: HTMLDivElement;
  
  constructor() {
    super();
    
    this._controlsView = this.buildControlsView();

    const previousIcon = new Icon(previous(), "20px", false);
    previousIcon.setColor(window.theme.bgAccent);
    const previousControl = new Control(previousIcon, () => {
      console.log("previous");
    });
    this._controlsView.appendChild(previousControl);

    const playIcon = new Icon(play(), "20px", true);
    playIcon.setColor(window.theme.bgAccent);
    const playControl = new Control(playIcon, () => {
      console.log("play");
    });
    this._controlsView.appendChild(playControl);

    const nextIcon = new Icon(next(), "20px", false);
    nextIcon.setColor(window.theme.bgAccent);
    const nextControl = new Control(nextIcon, () => {
      console.log("next");
    });
    this._controlsView.appendChild(nextControl);

    this.appendChild(this._controlsView);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "sticky",
      bottom: "0px",
      padding: "1em",
      height: "100px",
      backgroundColor: window.theme.fgPrimary + "22",
    } as CSSStyleDeclaration);
  }

  private buildControlsView() {
    const controlsView = document.createElement("div");
    applyStyles(controlsView, {
      ...universalStyles,
      display: "flex",
    } as CSSStyleDeclaration);
    return controlsView;
  }
}

customElements.define("audio-player", AudioPlayer);

export default AudioPlayer;
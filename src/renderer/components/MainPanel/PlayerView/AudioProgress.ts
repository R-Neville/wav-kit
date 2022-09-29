import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class AudioProgress extends HTMLElement {
  private _duration: number;
  private _progress: HTMLDivElement;

  constructor() {
    super();

    this._duration = 0;
    this._progress = this.buildProgress();

    this.appendChild(this._progress);

    applyStyles(this, {
      ...universalStyles,
      height: "5px",
      borderRadius: "5px",
      width: "100%",
      margin: "0.5em 0",
      backgroundColor: window.theme.bgAccent,
    } as CSSStyleDeclaration);
  }

  setDuration(duration: number) {
    this._duration = duration;
  }

  update(currentTime: number) {
    const width = currentTime / this._duration * this.getBoundingClientRect().width;
    this._progress.style.width = width + "px";
  }

  reset() {
    this._duration = 0;
    this._progress.style.width = "0px";
  }

  private buildProgress() {
    const progress = document.createElement("div");
    applyStyles(progress, {
      ...universalStyles,
      height: "100%",
      width: "0",
      borderRadius: "5px",
      backgroundColor: window.theme.bgPrimary,
    } as CSSStyleDeclaration);
    return progress;
  }
}

customElements.define("audio-progress", AudioProgress);

export default AudioProgress;
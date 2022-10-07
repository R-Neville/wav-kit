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
      cursor: "pointer",
    } as CSSStyleDeclaration);

    this.addEventListener("click", this.onClick as EventListener);
  }

  setDuration(duration: number) {
    this._duration = duration;
  }

  update(currentTime: number) {
    const width = currentTime / this._duration * this.getBoundingClientRect().width;
    this._progress.style.width = width + "px";
  }

  private buildProgress() {
    const progress = document.createElement("div");
    applyStyles(progress, {
      ...universalStyles,
      height: "100%",
      width: "0",
      borderRadius: "5px",
      backgroundColor: window.theme.bgTertiary,
    } as CSSStyleDeclaration);
    return progress;
  }

  private onClick(event: MouseEvent) {
    const { offsetX } = event;
    const { width } = this.getBoundingClientRect();
    const newTime = (offsetX / width * (this._duration / 1000)).toFixed(2);
    const customEvent = new CustomEvent("seek-to-new-time", {
      bubbles: true,
      detail: {
        newTime,
      },
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("audio-progress", AudioProgress);

export default AudioProgress;
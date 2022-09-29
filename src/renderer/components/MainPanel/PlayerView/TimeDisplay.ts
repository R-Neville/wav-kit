import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class TimeDisplay extends HTMLElement {
  private _duration: string;
  private _currentTime: string;

  constructor() {
    super();

    this._duration = "00:00";
    this._currentTime = "00:00";

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      margin: "0.5em 0",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
  }

  setDuration(duration: number) {
    this._duration = this.buildTimeString(duration);
  }

  update(currentTime: number) {
    this._currentTime = this.buildTimeString(currentTime);
    this.textContent = `${this._currentTime} | ${this._duration}`;
  }

  private buildTimeString(duration: number) {
    const ms = duration % 1000;
    duration = (duration - ms) / 1000;
    const sec = duration % 60;
    duration = (duration - sec) / 60;
    const min = duration % 60;
    const hr = (duration - min) / 60;
    
    let timeString = "";
    
    if (hr) {
      timeString += `${hr}:`;
    }

    timeString += this.pad(min) + ":" + this.pad(sec);

    return timeString;
  }

  private pad(num: number) {
    const numString = num.toString();
    if (numString.length < 2) {
      return "0" + numString;
    }
    return numString;
  }
}

customElements.define("time-display", TimeDisplay);

export default TimeDisplay;
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Control from "./Control";
import { next, pause, play, previous } from "../../../icons";
import Icon from "../../shared/Icon";
import AudioProgress from "./AudioProgress";
import TimeDisplay from "./TimeDisplay";

class AudioPlayer extends HTMLElement {
  private _visible: boolean;
  private _playing: boolean;
  private _inQueue: boolean;
  private _audio: HTMLAudioElement | null;
  private _title: HTMLHeadingElement;
  private _timeDisplay: TimeDisplay;
  private _controlsView: HTMLDivElement;
  private _progressBar: AudioProgress;
  private _playIcon: Icon;
  private _pauseIcon: Icon;
  private _playControl: Control;
  private _previousControl: Control;
  private _nextControl: Control;
  
  constructor() {
    super();
    
    this._visible = false;
    this._playing = false;
    this._inQueue = false;
    this._audio = null;
    this._title = this.buildTitle();
    this._timeDisplay = new TimeDisplay();
    this._timeDisplay.setDuration(0);
    this._timeDisplay.update(0);
    this._progressBar = new AudioProgress();
    this._controlsView = this.buildControlsView();

    this.appendChild(this._title);
    this.appendChild(this._timeDisplay);
    this.appendChild(this._progressBar);

    const previousIcon = new Icon(previous(), "20px", false);
    previousIcon.setColor(window.theme.bgAccent);
    this._previousControl = new Control(previousIcon, () => {
      if (this._audio) {
        this.pause();
        if (this._audio.currentTime > 0) {
          this._audio.currentTime = 0;
          this._progressBar.update(0);
        }
      }
    });
    this._controlsView.appendChild(this._previousControl);

    this._playIcon = new Icon(play(), "20px", true);
    this._pauseIcon = new Icon(pause(), "20px", true);
    this._playIcon.setColor(window.theme.bgAccent);
    this._pauseIcon.setColor(window.theme.bgAccent);
    this._playControl = new Control(this._playIcon, () => {
      if (this._audio) {
        if (this._playing) {
          this.pause();
        } else {
          this.play();
        }
      }
    });
    this._controlsView.appendChild(this._playControl);

    const nextIcon = new Icon(next(), "20px", false);
    nextIcon.setColor(window.theme.bgAccent);
    this._nextControl = new Control(nextIcon, () => {
      console.log("next");
    });
    this._controlsView.appendChild(this._nextControl);

    this.appendChild(this._controlsView);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      flexDirection: "column",
      alignItems: "center",
      position: "sticky",
      bottom: "0px",
      padding: "1em",
      backgroundColor: window.theme.fgPrimary + "22",
    } as CSSStyleDeclaration);

    this.addEventListener("seek-to-new-time", this.onSeekToNewTime as EventListener);
  }

  get visible() {
    return this._visible;
  }

  get playing() {
    return this._playing;
  }

  get inQueue() {
    return this._inQueue;
  }

  show() {
    this._visible = true;
    this.style.display = "flex";
  }

  hide() {
    this._visible = false;
    this.style.display = "none";
  }

  loadFile(path: string, inQueue?: boolean) {
    this._inQueue = inQueue || false;

    if (this._audio) {
      this.pause();
      this._audio = null;
    }

    this._progressBar.update(0);

    this._audio = this.createAudio(path);
  }

  play() {
    if (this._audio) {
      this._audio.play();
      this._playing = true;
      this._playIcon.remove();
      this._playControl.appendChild(this._pauseIcon);
    }
  }

  pause() {
    if (this._audio) {
      this._audio.pause();
      this._playing = false;
      this._pauseIcon.remove();
      this._playControl.appendChild(this._playIcon);
    }
  }

  private buildTitle() {
    const title = document.createElement("h3");
    applyStyles(title, {
      ...universalStyles,
      margin: "0",
      textAlign: "center",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
    return title;
  }

  private setTitle(title: string) {
    this._title.textContent = title;
  }

  private buildControlsView() {
    const controlsView = document.createElement("div");
    applyStyles(controlsView, {
      ...universalStyles,
      display: "flex",
    } as CSSStyleDeclaration);
    return controlsView;
  }

  private createAudio(path: string) {
    const audio = new Audio(path);
    audio.addEventListener("error", () => {
      const message = `There was an error loading the file ${path}`;
      window.api.dialog.showErrorMessage(message);
    });
    audio.addEventListener("canplay", () => {
      if (!isNaN(audio.duration)) {
        this._timeDisplay.setDuration(audio.duration * 1000);
      } else {
        this._timeDisplay.setDuration(0);
      }
      this._timeDisplay.update(0);
      this._progressBar.setDuration(audio.duration * 1000);
      this.setTitle(window.api.path.basename(path));
    });
    audio.addEventListener("timeupdate", () => {
      const ms = audio.currentTime * 1000;
      this._timeDisplay.update(ms);
      this._progressBar.update(ms);
    });
    audio.addEventListener("ended", () => {
      this._playing = false;
      this._pauseIcon.remove();
      this._playControl.appendChild(this._playIcon);
      this._progressBar.update(0);
      this._timeDisplay.update(0);
      const customEvent = new CustomEvent("file-ended", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    return audio;
  }

  private onSeekToNewTime(event: CustomEvent) {
    const { newTime } = event.detail;
    if (this._audio) {
      this._audio.currentTime = newTime;
      const ms = this._audio.currentTime * 1000;
      this._timeDisplay.update(ms);
      this._progressBar.update(ms);
      if (!this._playing) {
        this.play();
      }
    }
  }
}

customElements.define("audio-player", AudioPlayer);

export default AudioPlayer;
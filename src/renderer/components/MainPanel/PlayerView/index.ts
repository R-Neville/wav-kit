import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import MainPanelView from "../MainPanelView";
import AudioPlayer from "./AudioPlayer";
import FileView from "./FileView";

class PlayerView extends MainPanelView {
  private _fileView: FileView;
  private _audioPlayer: AudioPlayer;

  constructor() {
    super("Audio Player");

    this.addHeaderActions();
    this._fileView = new FileView();
    this._audioPlayer = new AudioPlayer();

    this._body.appendChild(this._fileView);
    this._body.appendChild(this._audioPlayer);

    applyStyles(this._body, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "1fr max-content",
      overflow: "hidden",
      padding: "0",
      maxHeight: "100%",
    } as CSSStyleDeclaration);

    this.addEventListener("add-file", this.onAddFile as EventListener);
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  private addHeaderActions() {
    this.addHeaderAction("Clear", () => {
      this._fileView.clear();
    });
    this.addHeaderAction("Import", async () => {
      const filenames = await window.api.dialog.showOpenFilesDialog();
      if (filenames !== null) {
        filenames.forEach((filename) => {
          const customEvent = new CustomEvent("add-file", {
            bubbles: true,
            detail: {
              path: filename,
            },
          });
          this.dispatchEvent(customEvent);
        });
      }
    });
  }

  private onAddFile(event: CustomEvent) {
    event.stopPropagation();
    const { path } = event.detail;
    this.processFile(path);    
  }

  private async processFile(path: string) {
    const stats = await window.api.file.statsFromPath(path);
    if (stats) {
      this._fileView.addItem(stats);
    }
  }
}

customElements.define("player-view", PlayerView);

export default PlayerView;

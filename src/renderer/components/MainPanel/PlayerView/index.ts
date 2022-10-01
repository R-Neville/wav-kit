import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import TabView from "../../shared/TabView";
import Tab from "../../shared/TabView/Tab";
import MainPanelView from "../MainPanelView";
import AudioPlayer from "./AudioPlayer";
import FileView from "./FileView";

class PlayerView extends MainPanelView {
  private _files: FileStats[];
  private _queue: string[];
  private _tabView: TabView;
  private _fileView: FileView;
  private _audioPlayer: AudioPlayer;

  constructor() {
    super("Audio Player");

    this._files = [];
    this._queue = [];

    this.addHeaderActions();
    this._fileView = new FileView();
    this._tabView = this.buildTabView();
    this._tabView.setContent(this._fileView);
    this._audioPlayer = new AudioPlayer();
    this._audioPlayer.show();

    this._body.appendChild(this._tabView);
    this._body.appendChild(this._audioPlayer);

    applyStyles(this._body, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "minmax(0, 1fr) max-content",
      overflow: "hidden",
      padding: "0",
      maxHeight: "100%",
    } as CSSStyleDeclaration);

    this.addEventListener("add-file", this.onAddFile as EventListener);
    this.addEventListener(
      "play-file-requested",
      this.onPlayFileRequested as EventListener
    );
    this.addEventListener("all-files-cleared", this.onAllFilesCleared as EventListener);
    this.addEventListener("file-cleared", this.onFileCleared as EventListener);
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  addFile(path: string) {
    const found = this._files.filter((file) => {
      return file.path === path;
    });
    if (found.length === 0) {
      this.processFile(path);
    }
  }

  playFile(path: string) {
    if (this._audioPlayer.playing) {
      this._audioPlayer.pause();
    }
    this._audioPlayer.loadFile(path);
    this._audioPlayer.play();
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

  private buildTabView() {
    const tabView = new TabView();
    tabView.addTab(
      "Files",
      (event) => {
        const target = event.target as Tab;
        if (!target.active) {
          tabView.setContent(this._fileView);
        }
      },
      true
    );
    tabView.addTab(
      "Queue",
      (event) => {
        console.log("queue");
      },
      false
    );
    tabView.addTab(
      "Playlists",
      (event) => {
        console.log("playlists");
      },
      false
    );
    return tabView;
  }

  private async processFile(path: string) {
    const stats = await window.api.file.statsFromPath(path);
    if (stats) {
      this._files.push(stats);
      this._fileView.addItem(stats);
    }
  }

  private onAddFile(event: CustomEvent) {
    event.stopPropagation();
    const { path } = event.detail;
    this.processFile(path);
  }

  private onPlayFileRequested(event: CustomEvent) {
    event.stopPropagation();
    const { path } = event.detail;
    this.playFile(path);
  }

  private onAllFilesCleared(event: CustomEvent) {
    event.preventDefault();
    this._files = [];
  }

  private onFileCleared(event: CustomEvent) {
    event.preventDefault();
    const { index } = event.detail;
    this._files.splice(index, 1);
  }
}

customElements.define("player-view", PlayerView);

export default PlayerView;

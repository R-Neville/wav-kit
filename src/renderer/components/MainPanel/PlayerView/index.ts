import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import TabView from "../../shared/TabView";
import Tab from "../../shared/TabView/Tab";
import MainPanelView from "../MainPanelView";
import AudioPlayer from "./AudioPlayer";
import FileView from "./FileView";
import PlaylistsView from "./PlaylistsView";
import QueueView from "./QueueView";

class PlayerView extends MainPanelView {
  private _files: FileStats[];
  private _queue: FileStats[];
  private _tabView: TabView;
  private _fileView: FileView;
  private _queueView: QueueView;
  private _playlistsView: PlaylistsView;
  private _audioPlayer: AudioPlayer;

  constructor() {
    super("Audio Player");

    this._files = [];
    this._queue = [];

    this.addMenu();
    this.addMenuOptions();
    this._fileView = new FileView();
    this._queueView = new QueueView();
    this._playlistsView = new PlaylistsView();
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

    this.addEventListener(
      "import-file-requested",
      this.onImportFileRequested as EventListener
    );
    this.addEventListener("add-file", this.onAddFile as EventListener);
    this.addEventListener(
      "play-file-requested",
      this.onPlayFileRequested as EventListener
    );
    this.addEventListener(
      "all-files-cleared",
      this.onAllFilesCleared as EventListener
    );
    this.addEventListener(
      "file-item-cleared",
      this.onFileItemCleared as EventListener
    );
    this.addEventListener(
      "add-file-to-queue",
      this.onAddFileToQueue as EventListener
    );
    this.addEventListener(
      "queue-item-cleared",
      this.onQueueItemCleared as EventListener
    );
    this.addEventListener("file-ended", this.onFileEnded as EventListener);
    this.addEventListener("next-file-requested", this.onNextFileRequested as EventListener);
  }

  connectedCallback() {
    this.loadImportedFiles();
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  addFile(path: string) {
    this.processFile(path);
  }

  playFile(path: string) {
    if (this._audioPlayer.playing) {
      this._audioPlayer.pause();
    }
    this._audioPlayer.loadFile(path);
    this._audioPlayer.play();
  }

  private async loadImportedFiles() {
    const paths = await window.api.config.importedFiles();
    paths.forEach(async (path) => {
      const stats = await window.api.file.statsFromPath(path);
      if (stats) {
        const found = this._files.filter((file) => file.path === stats.path);
        if (found.length === 0) {
          this._files.push(stats);
          this._fileView.addItem(stats);
        }
      }
    });
  }

  private addMenuOptions() {
    if (this._menu) {
      this._menu.addOption("Import File", async () => {
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
      this._menu.addOption("Clear Files", () => {
        this._fileView.clear();
      });
    }
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
      true,
      [
        {
          text: "Import File",
          onClick: (() => {
            this.importFile();
          }).bind(this),
        },
        {
          text: "Clear Files",
          onClick: (() => {
            this._fileView.clear();
          }).bind(this),
        },
      ]
    );
    tabView.addTab(
      "Queue",
      (event) => {
        const target = event.target as Tab;
        if (!target.active) {
          tabView.setContent(this._queueView);
        }
      },
      false
    );
    tabView.addTab(
      "Playlists",
      (event) => {
        const target = event.target as Tab;
        if (!target.active) {
          tabView.setContent(this._playlistsView);
        }
      },
      false
    );
    return tabView;
  }

  private async importFile() {
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
  }

  private async processFile(path: string) {
    const stats = await window.api.file.statsFromPath(path);
    if (stats) {
      const found = this._files.filter((file) => file.path === stats.path);
      if (found.length === 0) {
        this._files.push(stats);
        this._fileView.addItem(stats);
        window.api.config.addImportedFile(stats.path);
      }
    }
  }

  private onImportFileRequested(event: CustomEvent) {
    event.stopPropagation();
    this.importFile();
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
    event.stopPropagation();
    this._files = [];
    window.api.config.removeAllImportedFiles();
  }

  private onFileItemCleared(event: CustomEvent) {
    event.stopPropagation();
    const { index } = event.detail;
    this._files.splice(index, 1);
    window.api.config.removeImportedFile(index);
  }

  private onAddFileToQueue(event: CustomEvent) {
    event.stopPropagation();
    const { index } = event.detail;
    const file = this._files[index];
    const found = this._queue.filter((f) => f.path === file.path);
    if (found.length === 0) {
      this._queue.push(file);
      this._queueView.addItem(file);
      if (!this._audioPlayer.playing) {
        this._audioPlayer.loadFile(file.path, true);
        this._audioPlayer.play();
      }
    }
  }

  private onQueueItemCleared(event: CustomEvent) {
    event.stopPropagation();
    const { index } = event.detail;
    this._queue.splice(index, 1);
  }

  private onFileEnded(event: CustomEvent) {
    event.stopPropagation();
    this.playNextFile();
  }

  private onNextFileRequested(event: CustomEvent) {
    event.stopPropagation();
    this.playNextFile();
  }

  private playNextFile() {
    if (this._audioPlayer.inQueue) {
      const queueFirst = this._queue[0];
      if (queueFirst && queueFirst.path === this._audioPlayer.path) {
        this.shiftQueue();
      }
    }
    if (this._queue.length > 0) {
      const queueNext = this._queue[0];
      this._audioPlayer.loadFile(queueNext.path, true);
      this._audioPlayer.play();
    } else {
      setTimeout(() => {
        this._audioPlayer.clear();
      });
    }
  }

  private shiftQueue() {
    this._queue.shift();
    this._queueView.removeFirstItem();
  }
}

customElements.define("player-view", PlayerView);

export default PlayerView;

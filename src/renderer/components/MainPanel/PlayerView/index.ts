import FileStats from "../../../../shared/FileStats";
import Playlist from "../../../../shared/Playlist";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import TabView from "../../shared/TabView";
import Tab from "../../shared/TabView/Tab";
import MainPanelView from "../MainPanelView";
import AudioPlayer from "./AudioPlayer";
import FileView from "./FileView";
import PlaylistsView from "./PlaylistsView";
import QueueView from "./QueueView";
import Modal from "../../shared/Modal";
import PlaylistView from "./PlaylistView";

class PlayerView extends MainPanelView {
  private _files: FileStats[];
  private _queue: FileStats[];
  private _playlists: Playlist[];
  private _playlist: Playlist | null;
  private _playlistIndex: number;
  private _tabView: TabView;
  private _fileView: FileView;
  private _queueView: QueueView;
  private _playlistsView: PlaylistsView;
  private _playlistView: PlaylistView | null;
  private _audioPlayer: AudioPlayer;

  constructor() {
    super("Audio Player");

    this._files = [];
    this._queue = [];
    this._playlists = [];
    this._playlist = null;
    this._playlistIndex = 0;

    this.addMenu();
    this.addMenuOptions();
    this._fileView = new FileView();
    this._queueView = new QueueView();
    this._playlistsView = new PlaylistsView();
    this._tabView = this.buildTabView();
    this._tabView.setContent(this._fileView);
    this._playlistView = null;
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
    this.addEventListener(
      "next-file-requested",
      this.onNextFileRequested as EventListener
    );
    this.addEventListener(
      "new-playlist-created",
      this.onNewPlaylistCreated as EventListener
    );
    this.addEventListener(
      "delete-playlist",
      this.onDeletePlaylist as EventListener
    );
    this.addEventListener("show-tab-view", this.onShowTabView as EventListener);
    this.addEventListener(
      "show-playlist-view",
      this.onShowPlaylistView as EventListener
    );
    this.addEventListener(
      "playlist-updated",
      this.onPlaylistUpdated as EventListener
    );
    this.addEventListener(
      "play-file-from-playlist-requested",
      this.onPlayFileFromPlaylistRequested as EventListener
    );
    this.addEventListener(
      "add-file-to-playlist",
      this.onAddFileToPlaylist as EventListener
    );
  }

  connectedCallback() {
    this.loadImportedFiles();
    this.loadPlaylists();
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

  private async loadPlaylists() {
    const playlists = await window.api.config.playlists();
    playlists.forEach((playlist) => {
      this._playlists.push(playlist);
      this._playlistsView.addItem(playlist);
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
      false,
      [
        {
          text: "New Playlist",
          onClick: () => {
            const modal = new Modal("Enter a name for the playlist:");
            const onInput = async () => {
              const value = modal.inputValue;
              if (value.length === 0) {
                modal.lock();
                return;
              }
              const isAvailable = await window.api.config.validatePlaylistName(
                value
              );
              if (!isAvailable) {
                modal.lock();
                return;
              }
              modal.unlock();
            };
            modal.addInput(onInput, "");
            modal.addAction("Cancel", () => {
              modal.destroy();
            });
            modal.addAction("Confirm", () => {
              const value = modal.inputValue;
              if (value.length === 0) {
                modal.lock();
                return;
              }
              window.api.config.createPlaylist(value);
              const customEvent = new CustomEvent("new-playlist-created", {
                bubbles: true,
                detail: {
                  name: value,
                },
              });
              this.dispatchEvent(customEvent);
              modal.destroy();
            });
            document.body.appendChild(modal);
          },
        },
      ]
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

  private onPlayFileFromPlaylistRequested(event: CustomEvent) {
    event.stopPropagation();
    const { playlist, file } = event.detail;
    const foundPlaylist = this._playlists.find((p) => {
      return p.name === playlist;
    });
    if (foundPlaylist) {
      this._playlist = foundPlaylist;
      this._playlistIndex = this._playlist.files.indexOf(file);
      this.playFile(file);
    }
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
      return;
    }

    if (this._playlist) {
      if (this._playlistIndex < this._playlist.files.length - 1) {
        this._playlistIndex += 1;
        this.playFile(this._playlist.files[this._playlistIndex]);
        return;
      } else {
        this._playlistIndex = 0;
        this._playlist = null;
      }
    }

    setTimeout(() => {
      this._audioPlayer.clear();
    });
  }

  private shiftQueue() {
    this._queue.shift();
    this._queueView.removeFirstItem();
  }

  private onNewPlaylistCreated(event: CustomEvent) {
    event.stopPropagation();
    const { name } = event.detail;
    const playlist = {
      name,
      files: [],
    } as Playlist;
    this._playlists.push(playlist);
    this._playlistsView.addItem(playlist);
  }

  private onDeletePlaylist(event: CustomEvent) {
    event.stopPropagation();
    const { name } = event.detail;
    const found = this._playlists.filter((p) => p.name === name);
    if (found.length > 0) {
      const playlist = found[0];
      const index = this._playlists.indexOf(playlist);
      this._playlists.splice(index, 1);
      window.api.config.deletePlaylistAtIndex(index);
      this._playlistsView.removeItemAtIndex(index);
      this._playlistView?.remove();
      this._playlistView = null;
    }
  }

  private onShowTabView(event: CustomEvent) {
    event.stopPropagation();
    this._playlistView?.remove();
    this._body.insertBefore(this._tabView, this._audioPlayer);
  }

  private onShowPlaylistView(event: CustomEvent) {
    event.stopPropagation();
    const { playlist } = event.detail;
    if (!this._playlistView || this._playlistView.name !== playlist.name) {
      this._playlistView = new PlaylistView(playlist);
    } else {
      this._playlistView.update(playlist);
    }
    this._tabView.remove();
    this._body.insertBefore(this._playlistView, this._audioPlayer);
  }

  private onPlaylistUpdated(event: CustomEvent) {
    event.stopPropagation();
    const { playlist } = event.detail;
    for (let i = 0; i < this._playlists.length; i++) {
      if (this._playlists[i].name === playlist.name) {
        Object.assign(this._playlists[i].files, playlist.files);
        this._playlistsView.replaceItemAtIndex(i, playlist);
        break;
      }
    }
  }

  private onAddFileToPlaylist(event: CustomEvent) {
    event.stopPropagation();
    const { index } = event.detail;
    const file = this._files[index].path;
    const playlistNames = this._playlists.map((p) => p.name);
    const modal = new Modal("Select the playlist:");
    modal.addSelector(playlistNames);
    modal.addAction("Cancel", () => {
      modal.destroy();
    });
    modal.addAction("Confirm", () => {
      if (modal.valid) {
        const playlistName = modal.selection;
        const playlistFound = this._playlists.find((p) => p.name === playlistName);
        if (playlistFound) {
          playlistFound.files.push(file);
          const playlistIndex = this._playlists.indexOf(playlistFound);
          this._playlistsView.replaceItemAtIndex(playlistIndex, playlistFound);
          window.api.config.addFileToPlaylist(file, playlistFound.name);
        }
        modal.destroy();
      }
    });
    document.body.appendChild(modal);
  }
}

customElements.define("player-view", PlayerView);

export default PlayerView;

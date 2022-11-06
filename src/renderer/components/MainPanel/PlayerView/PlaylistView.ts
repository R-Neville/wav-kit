import Playlist from "../../../../shared/Playlist";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import PlaylistFileView from "./PlaylistFileView";

class PlaylistView extends HTMLElement {
  private _playlist: Playlist;
  private _header: HTMLDivElement;
  private _fileView: PlaylistFileView;

  constructor(playlist: Playlist) {
    super();

    this._playlist = playlist;

    this._header = this.buildHeader(this._playlist.name);
    this._fileView = new PlaylistFileView();

    this.appendChild(this._header);
    this.appendChild(this._fileView);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content minmax(0, 1fr)",
      margin: "1em",
    } as CSSStyleDeclaration);

    this.addEventListener(
      "add-file-to-playlist-requested",
      this.onAddFileToPlaylistRequested as EventListener
    );

    this.addEventListener(
      "file-removed-from-playlist",
      this.onFileRemovedFromPlaylist as EventListener
    );

    this._playlist.files.forEach(async (filename) => {
      const stats = await window.api.file.statsFromPath(filename);
      if (stats) {
        this._fileView.addItem(stats);
      }
    });
  }

  get name() {
    return this._playlist.name;
  }

  private buildHeader(name: string) {
    const header = document.createElement("div");
    header.textContent = name;
    applyStyles(header, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5em 1em",
      backgroundColor: window.theme.fgHighlight + "22",
      fontSize: "1em",
      color: window.theme.fgPrimary,
    } as CSSStyleDeclaration);
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    applyStyles(backButton, {
      ...universalStyles,
      border: "none",
      borderRadius: "3px",
      backgroundColor: window.theme.bgAccent,
      color: window.theme.fgAccent,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    backButton.addEventListener("click", () => {
      const customEvent = new CustomEvent("show-tab-view", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    header.appendChild(backButton);
    return header;
  }

  private async onAddFileToPlaylistRequested() {
    const filenames = await window.api.dialog.showOpenFilesDialog();
    if (filenames) {
      filenames.forEach(async (filename) => {
        if (!this._playlist.files.includes(filename)) {
          await this.addFileToPlaylist(filename);
        }
      });
    }
  }

  private async addFileToPlaylist(filename: string) {
    const stats = await window.api.file.statsFromPath(filename);
    if (stats) {
      window.api.config.addFileToPlaylist(filename, this._playlist.name);
      this._fileView.addItem(stats);
    }
  }

  private onFileRemovedFromPlaylist(event: CustomEvent) {
    const { index } = event.detail;
    this._playlist.files.splice(index, 1);
    window.api.config.removeFileFromPlaylist(index, this._playlist.name);
    const customEvent = new CustomEvent("playlist-updated", {
      bubbles: true,
      detail: {
        playlist: this._playlist,
      },
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("playlist-view", PlaylistView);

export default PlaylistView;

import Playlist from "../../../../shared/Playlist";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import PlaylistFileView from "./PlaylistFileView";

class PlaylistView extends HTMLElement {
  private _playlist: Playlist;
  private _header: HTMLDivElement;
  private _contentWrapper: HTMLDivElement;
  private _fileView: PlaylistFileView;

  constructor(playlist: Playlist) {
    super();

    this._playlist = playlist;

    this._header = this.buildHeader(this._playlist.name);
    this._contentWrapper = this.buildContentWrapper();
    this._fileView = new PlaylistFileView();

    this.appendChild(this._header);
    // this.appendChild(this._contentWrapper);
    this.appendChild(this._fileView);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content minmax(0, 1fr)",
      margin: "1em",
    } as CSSStyleDeclaration);

    this._playlist.files.forEach(async (filename) => {
      const stats = await window.api.file.statsFromPath(filename);
      if (stats) {
        this._fileView.addItem(stats);
      }
    });
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

  private buildContentWrapper() {
    const contentWrapper = document.createElement("div");
    applyStyles(contentWrapper, {
      ...universalStyles,
    } as CSSStyleDeclaration);
    return contentWrapper;
  }
}

customElements.define("playlist-view", PlaylistView);

export default PlaylistView;
